import os
from flask import Flask, render_template, redirect, url_for, flash, request, session, jsonify
from sqlalchemy import or_
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime

import hmac
import hashlib
from .events_data import get_event_data, EVENTS_DATA
from .config import Config, config
from .models import db, User, OTP, PendingRegistration, GreatStepRegistration
from .email_service import send_verification_email, send_login_otp, send_reset_password_email, send_payment_confirmation_email

app = Flask(__name__)

@app.route('/healthcheck')
def healthcheck():
    return jsonify({"status": "ok"}), 200

# Maintenance Mode Check
@app.before_request
def check_maintenance_mode():
    if os.environ.get('MAINTENANCE_MODE') == 'true':
        # Allow static files to be served so pages (if any) look okay
        if request.path.startswith('/static'):
            return
            
        # You can either return a 503 error string or render a maintenance template
        # For simplicity, returning a clear HTML response
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Maintenance In Progress</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 50px; }
                h1 { color: #e74c3c; }
            </style>
        </head>
        <body>
            <h1>System Maintenance</h1>
            <p>We are currently establishing a secure connection to our new servers.</p>
            <p>Please check back in a few minutes.</p>
        </body>
        </html>
        """, 503

# Load config based on FLASK_ENV
import os
flask_env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config.get(flask_env, Config))
print(f"[INFO] Loaded {flask_env} configuration, DEBUG={app.config.get('DEBUG', False)}")

# Session configuration for better compatibility
app.config['SESSION_COOKIE_SAMESITE'] = app.config.get('SESSION_COOKIE_SAMESITE', 'Lax')
app.config['SESSION_COOKIE_SECURE'] = app.config.get('SESSION_COOKIE_SECURE', False)
app.config['SESSION_COOKIE_HTTPONLY'] = app.config.get('SESSION_COOKIE_HTTPONLY', True)

# Optimize bandwidth with Caching Headers
@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    if 'Cache-Control' not in response.headers:
        # Cache static assets for 1 year (immutable), other content for 10 minutes
        if request.path.startswith('/static'):
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        else:
            response.headers['Cache-Control'] = 'public, max-age=600'
    return response

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Database connection cleanup for serverless environments
@app.teardown_appcontext
def shutdown_session(exception=None):
    """Close database connections after each request"""
    db.session.remove()

# Create tables if they don't exist (for development)
with app.app_context():
    db.create_all()


# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print(f"[DEBUG] login_required check - user_id in session: {session.get('user_id')}")
        if 'user_id' not in session:
            flash('Please sign in to access this page', 'error')
            return redirect(url_for('signin'))
        return f(*args, **kwargs)
    return decorated_function

# Admin required decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please sign in to access this page', 'error')
            return redirect(url_for('signin'))
        
        try:
            user = User.query.get(session['user_id'])
            if not user or not user.is_admin:
                flash('Admin access only', 'error')
                return redirect(url_for('home'))
        except Exception as e:
            # Handle database connection errors
            app.logger.error(f"Database error in admin_required: {e}")
            session.clear()
            flash('Database connection error. Please try signing in again.', 'error')
            return redirect(url_for('signin'))
            
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin/cleanup-db', methods=['POST'])
@admin_required
def admin_cleanup_db():
    """Run database cleanup script to remove invalid registrations and duplicate pending users"""
    try:
        from sqlalchemy import or_
        from .models import GreatStepRegistration, PendingRegistration, User, db
        
        # 1. Cleanup Invalid GreatStep Registrations
        invalid_query = GreatStepRegistration.query.filter(
            or_(
                GreatStepRegistration.payment_status == 'pending',
                (
                    (GreatStepRegistration.transaction_id == None) | (GreatStepRegistration.transaction_id == '')
                )
            )
        )
        
        gs_records = invalid_query.all()
        gs_count = len(gs_records)
        for reg in gs_records:
            db.session.delete(reg)
            
        # 2. Cleanup Duplicate Pending Registrations
        # Find pending regs where email already exists in User table
        # We need to use subquery or in_ clause
        users_emails = db.session.query(User.email)
        duplicate_pending = PendingRegistration.query.filter(
            PendingRegistration.email.in_(users_emails)
        ).all()
        
        pending_count = len(duplicate_pending)
        for p in duplicate_pending:
            db.session.delete(p)
            
        db.session.commit()
        
        messages = []
        if gs_count > 0:
            messages.append(f"Cleaned {gs_count} invalid GreatStep registrations.")
        if pending_count > 0:
            messages.append(f"Removed {pending_count} duplicate pending users.")
            
        if messages:
            flash(" ".join(messages), 'success')
        else:
            flash("Database is already clean. No issues found.", 'info')

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Cleanup failed: {e}")
        flash(f"Cleanup failed: {e}", 'error')
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    """Admin dashboard with stats and all registrations"""
    # Fetch registrations excluding those who haven't submitted payment details yet (status='pending')
    # AND excluding those with no transaction ID visible (e.g. empty manual trxn id AND empty razorpay id)
    registrations = GreatStepRegistration.query.filter(
        GreatStepRegistration.payment_status != 'pending',
        (GreatStepRegistration.transaction_id != None) & (GreatStepRegistration.transaction_id != '')
    ).order_by(GreatStepRegistration.created_at.desc()).all()
    
    # Calculate stats
    stats = {
        'total_registrations': len(registrations),
        'pending': sum(1 for r in registrations if r.payment_status == 'verification_pending'),
        'verified': sum(1 for r in registrations if r.payment_status == 'completed'),
        'revenue': sum(r.amount_paid for r in registrations if r.payment_status == 'completed') // 100
    }
    
    return render_template('admin_dashboard.html', registrations=registrations, stats=stats)

@app.route('/admin/verify-payment/<int:reg_id>', methods=['POST'])
@admin_required
def admin_verify_payment(reg_id):
    """Verify a payment (can be used to change status from pending/failed to completed)"""
    registration = GreatStepRegistration.query.get_or_404(reg_id)
    
    try:
        # Mark payment as completed
        registration.payment_status = 'completed'
        registration.payment_completed_at = datetime.utcnow()
        
        # Update user status
        user = User.query.filter_by(email=registration.email).first()
        if user:
            user.is_greatstep_registered = True
            user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        flash(f'Payment for {registration.first_name} verified successfully!', 'success')
        
        # Send confirmation email
        try:
            send_payment_confirmation_email(
                email=registration.email,
                name=registration.first_name,
                amount=registration.amount_paid,
                transaction_id=registration.transaction_id
            )
            flash('Confirmation email sent.', 'info')
        except Exception as e:
            app.logger.error(f"Failed to send confirmation email: {e}")
            flash('Payment verified but failed to send email.', 'warning')
        
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Verification failed: {e}")
        flash('Error updating database', 'error')
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/reject-payment/<int:reg_id>', methods=['POST'])
@admin_required
def admin_reject_payment(reg_id):
    """Reject a payment (can be used to change status from any state to failed)"""
    registration = GreatStepRegistration.query.get_or_404(reg_id)
    
    try:
        registration.payment_status = 'failed'
        # Clear the completion timestamp when rejecting
        registration.payment_completed_at = None
        
        # Update user status if they were registered
        user = User.query.filter_by(email=registration.email).first()
        if user:
            user.is_greatstep_registered = False
            user.updated_at = datetime.utcnow()
        
        db.session.commit()
        flash(f'Payment for {registration.first_name} rejected.', 'warning')
    except Exception as e:
        db.session.rollback()
        flash('Error updating database', 'error')
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/users')
@admin_required
def admin_users():
    """Admin page to manage users"""
    # Fetch all users
    users = User.query.order_by(User.created_at.desc()).all()
    return render_template('admin_users.html', users=users)

@app.route('/admin/users/promote/<int:user_id>', methods=['POST'])
@admin_required
def admin_promote_user(user_id):
    """Promote a user to admin"""
    user = User.query.get_or_404(user_id)
    
    if user.is_admin:
        flash(f'{user.email} is already an admin.', 'info')
    else:
        try:
            user.is_admin = True
            db.session.commit()
            flash(f'{user.email} promoted to Admin successfully!', 'success')
        except Exception as e:
            db.session.rollback()
            flash('Error updating database', 'error')
            
    return redirect(url_for('admin_users'))

@app.route('/admin/users/revoke/<int:user_id>', methods=['POST'])
@admin_required
def admin_revoke_user(user_id):
    """Revoke admin access from a user"""
    user = User.query.get_or_404(user_id)
    
    # Prevent revoking Main Admin
    main_admin = app.config.get('MAIN_ADMIN_EMAIL')
    if main_admin and user.email.lower() == main_admin.lower():
        flash('Cannot revoke access of the Main Admin.', 'error')
        return redirect(url_for('admin_users'))
    
    # Prevent self-revocation
    if user.id == session.get('user_id'):
        flash('You cannot revoke your own admin access.', 'error')
        return redirect(url_for('admin_users'))
        
    if not user.is_admin:
        flash(f'{user.email} is not an admin.', 'info')
    else:
        try:
            user.is_admin = False
            db.session.commit()
            flash(f'Admin access revoked for {user.email}.', 'warning')
        except Exception as e:
            db.session.rollback()
            flash('Error updating database', 'error')
            
    return redirect(url_for('admin_users'))

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/sample')
def sample():
    return render_template('sample.html')

@app.route('/tmes')
def tmes():
    return render_template('tmes.html')

@app.route('/aboutus')
def about():
    return render_template('about.html')

@app.route('/great-step/events')
def events():
    # Auto redirect to competitions like React does
    return redirect(url_for('competitions'))

@app.route('/great-step/events/competitions')
def competitions():
    return render_template('competitions.html')

@app.route('/great-step/events/workshops')
def workshops():
    return render_template('workshops.html')

@app.route('/great-step/events/panel-discussion')
def panel_discussion():
    return render_template('panel_discussion.html')

# Individual Competition Pages
@app.route('/great-step/events/competitions/QS')
def quiz_spiel():
    event = get_event_data('Quiz_Spiel')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Enviro_CS')
def enviro_cs():
    event = get_event_data('Enviro_CS')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Petro_CS')
def petro_cs():
    event = get_event_data('Petro_CS')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Mine_CS')
def mine_cs():
    event = get_event_data('Mine_CS')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Safety_Hunt')
def safety_hunt():
    event = get_event_data('Safety_Hunt')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Safety_DA')
def safety_da():
    event = get_event_data('Safety_DA')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Geobotics')
def geobotics():
    event = get_event_data('Geobotics')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Pitch_Perfect')
def pitch_perfect():
    event = get_event_data('Pitch_Perfect')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Nmic')
def nmic():
    event = get_event_data('Nmic')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/code_ext')
def code_ext():
    event = get_event_data('code_ext')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Mine_A_Thon')
def mine_a_thon():
    event = get_event_data('Mine_A_Thon')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/gth')
def gth():
    event = get_event_data('gth')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/MS')
def mine_shot():
    event = get_event_data('Mine_Shot')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/quiz')
def publi_quiz():
    event = get_event_data('publiQuiz')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Indu_Design')
def indu_design():
    event = get_event_data('Indu_Design')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/great-step/events/competitions/Mineac')
def mineac():
    event = get_event_data('Mineac')
    return render_template('event_detail.html', 
                           event_name=event['name'],
                           event_image=url_for('static', filename=event['image']),
                           info_list=event['info'],
                           rules_url=event.get('rules'),
                           ps_url=event.get('ps'),
                           submission_url=event.get('submission'))

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if 'user_id' in session:
        return redirect(url_for('profile'))
    
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        if not email or not password:
            flash('Please fill in all fields', 'error')
            return render_template('signin.html')
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Check if there's a pending registration for this email
            pending = PendingRegistration.query.filter_by(email=email).first()
            if pending:
                if pending.is_valid():
                    # Redirect to complete verification
                    flash('Please complete your email verification first.', 'warning')
                    dev_otp = pending.otp_code if app.debug else None
                    return render_template('verify_otp.html',
                                           email=email,
                                           purpose='signup_verification',
                                           action_url=url_for('verify_signup'),
                                           back_url=url_for('signup'),
                                           dev_otp=dev_otp)
                else:
                    # Pending registration expired, delete it
                    db.session.delete(pending)
                    db.session.commit()
                    flash('Your registration expired. Please sign up again.', 'error')
                    return redirect(url_for('signup'))
            
            flash('Invalid email or password', 'error')
            return render_template('signin.html')
        
        if not user.is_verified:
            flash('Please verify your email first', 'error')
            return render_template('signin.html')
        
        if not user.check_password(password):
            flash('Invalid email or password', 'error')
            return render_template('signin.html')
        
        # Direct login (no OTP)
        session['user_id'] = user.id
        
        # Auto-promote Main Admin on direct login too
        main_admin = app.config.get('MAIN_ADMIN_EMAIL')
        if user and main_admin and user.email.lower() == main_admin.lower():
            if not user.is_admin:
                user.is_admin = True
                db.session.commit()
                print(f"[INFO] Main Admin {user.email} auto-promoted on direct login.")
        
        session['is_admin'] = user.is_admin
        flash('Signed in successfully!', 'success')
        return redirect(url_for('profile'))
    return render_template('signin.html')


@app.route('/verify-login', methods=['POST'])
def verify_login():
    email = request.form.get('email', '').strip().lower()
    otp_code = request.form.get('otp', '')
    
    if not email or not otp_code:
        flash('Invalid request', 'error')
        return redirect(url_for('signin'))
    
    user = User.query.filter_by(email=email).first()
    if not user:
        flash('User not found', 'error')
        return redirect(url_for('signin'))
    
    # Validate OTP
    otp = OTP.query.filter_by(user_id=user.id, purpose='login', is_used=False).order_by(OTP.created_at.desc()).first()
    
    if not otp or not otp.is_valid() or otp.code != otp_code:
        # Pass dev_otp for debugging when OTP is wrong
        dev_otp = otp.code if otp and app.debug else None
        return render_template('verify_otp.html',
                               email=email,
                               purpose='login',
                               action_url=url_for('verify_login'),
                               back_url=url_for('signin'),
                               error='Invalid or expired OTP',
                               dev_otp=dev_otp)
    
    # Mark OTP as used
    otp.use()
    
    # Auto-promote Main Admin
    main_admin = app.config.get('MAIN_ADMIN_EMAIL')
    if user and main_admin and user.email.lower() == main_admin.lower():
        if not user.is_admin:
            user.is_admin = True
            db.session.commit()
            print(f"[INFO] Main Admin {user.email} auto-promoted.")

    # Create session
    session['user_id'] = user.id
    session['user_email'] = user.email
    session['is_admin'] = user.is_admin
    session.permanent = True  # Make session persistent
    session.pop('pending_login_email', None)
    
    print(f"[DEBUG] Login successful for {user.email}, session user_id: {session.get('user_id')}")
    
    flash('Signed in successfully!', 'success')
    return redirect(url_for('home'))


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if 'user_id' in session:
        return redirect(url_for('profile'))
    
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        cpassword = request.form.get('cpassword', '')
        first_name = request.form.get('first_name', '').strip()
        last_name = request.form.get('last_name', '').strip()
        mobile = request.form.get('mobile', '').strip()
        college = request.form.get('college', '').strip()
        year = request.form.get('year', '').strip()
        
        # Validation
        if not email or not password or not cpassword or not first_name or not last_name:
            flash('Please fill in all required fields', 'error')
            return render_template('signup.html')
        
        if password != cpassword:
            flash('Passwords do not match', 'error')
            return render_template('signup.html')
        
        if len(password) < 6:
            flash('Password must be at least 6 characters', 'error')
            return render_template('signup.html')
        
        # Validate mobile number
        if mobile and (len(mobile) != 10 or not mobile.isdigit()):
            flash('Please enter a valid 10-digit mobile number', 'error')
            return render_template('signup.html')
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already registered. Please sign in.', 'error')
            return render_template('signup.html')
        
        # Create pending registration using the class method (handles OTP generation)
        pending = PendingRegistration.create(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            mobile=mobile if mobile else None,
            college=college if college else None,
            year=year if year else None
        )
        
        # Send verification email with the OTP from pending registration
        success, message = send_verification_email(email, pending.otp_code)
        
        if success:
            session['pending_signup_email'] = email
            # In dev mode, pass OTP to template for display
            dev_otp = pending.otp_code if app.debug else None
            return render_template('verify_otp.html',
                                   email=email,
                                   purpose='signup_verification',
                                   action_url=url_for('verify_signup'),
                                   back_url=url_for('signup'),
                                   dev_otp=dev_otp)
        else:
            flash('Failed to send verification email. Please try again.', 'error')
    
    return render_template('signup.html')


@app.route('/verify-signup', methods=['POST'])
def verify_signup():
    email = request.form.get('email', '').strip().lower()
    otp_code = request.form.get('otp', '')
    
    if not email or not otp_code:
        flash('Invalid request', 'error')
        return redirect(url_for('signup'))
    
    # Find pending registration
    pending = PendingRegistration.query.filter_by(email=email).first()
    if not pending:
        flash('Registration not found. Please sign up again.', 'error')
        return redirect(url_for('signup'))
    
    # Check if pending registration is expired
    if not pending.is_valid():
        db.session.delete(pending)
        db.session.commit()
        flash('Registration expired. Please sign up again.', 'error')
        return redirect(url_for('signup'))
    
    # Validate OTP against the pending registration's otp_code
    if pending.otp_code != otp_code:
        # Pass dev_otp for debugging when OTP is wrong
        dev_otp = pending.otp_code if app.debug else None
        return render_template('verify_otp.html',
                               email=email,
                               purpose='signup_verification',
                               action_url=url_for('verify_signup'),
                               back_url=url_for('signup'),
                               error='Invalid OTP. Please try again.',
                               dev_otp=dev_otp)
    
    # Create actual user account with all profile fields
    user = User(
        email=pending.email,
        password_hash=pending.password_hash,
        first_name=pending.first_name,
        last_name=pending.last_name,
        mobile=pending.mobile,
        college=pending.college,
        year=pending.year,
        is_verified=True
    )
    db.session.add(user)
    
    # Delete pending registration
    db.session.delete(pending)
    db.session.commit()
    
    session.pop('pending_signup_email', None)
    
    flash('Account created successfully! Please sign in.', 'success')
    return redirect(url_for('signin'))

@app.route('/resetPassword', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        
        if not email:
            flash('Please enter your email address', 'error')
            return render_template('reset_password.html')
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Don't reveal if email exists or not for security
            flash('If your email is registered, you will receive a password reset code.', 'info')
            return render_template('reset_password.html')
        
        # Generate and send reset OTP
        otp = OTP.create_otp(user.id, 'reset')
        
        success, message = send_reset_password_email(email, otp.code)
        
        if success:
            session['pending_reset_email'] = email
            dev_otp = otp.code if app.debug else None
            return render_template('verify_otp.html',
                                   email=email,
                                   purpose='reset',
                                   action_url=url_for('verify_reset'),
                                   back_url=url_for('reset_password'),
                                   dev_otp=dev_otp)
        else:
            flash('Failed to send reset email. Please try again.', 'error')
    
    return render_template('reset_password.html')


@app.route('/verify-reset', methods=['POST'])
def verify_reset():
    email = request.form.get('email', '').strip().lower()
    otp_code = request.form.get('otp', '')
    
    if not email or not otp_code:
        flash('Invalid request', 'error')
        return redirect(url_for('reset_password'))
    
    user = User.query.filter_by(email=email).first()
    if not user:
        flash('User not found', 'error')
        return redirect(url_for('reset_password'))
    
    # Validate OTP
    otp = OTP.query.filter_by(user_id=user.id, purpose='reset', is_used=False).order_by(OTP.created_at.desc()).first()
    
    if not otp or not otp.is_valid() or otp.code != otp_code:
        # Pass dev_otp for debugging when OTP is wrong
        dev_otp = otp.code if otp and app.debug else None
        return render_template('verify_otp.html',
                               email=email,
                               purpose='reset',
                               action_url=url_for('verify_reset'),
                               back_url=url_for('reset_password'),
                               error='Invalid or expired OTP',
                               dev_otp=dev_otp)
    
    # Mark OTP as used and store reset token in session
    otp.use()
    
    session['reset_verified_email'] = email
    return redirect(url_for('new_password'))


@app.route('/new-password', methods=['GET', 'POST'])
def new_password():
    email = session.get('reset_verified_email')
    
    if not email:
        flash('Please complete the reset process first', 'error')
        return redirect(url_for('reset_password'))
    
    if request.method == 'POST':
        password = request.form.get('password', '')
        cpassword = request.form.get('cpassword', '')
        
        if not password or not cpassword:
            flash('Please fill in all fields', 'error')
            return render_template('new_password.html')
        
        if password != cpassword:
            flash('Passwords do not match', 'error')
            return render_template('new_password.html')
        
        if len(password) < 6:
            flash('Password must be at least 6 characters', 'error')
            return render_template('new_password.html')
        
        user = User.query.filter_by(email=email).first()
        if user:
            user.set_password(password)
            db.session.commit()
            
            session.pop('reset_verified_email', None)
            flash('Password updated successfully! Please sign in.', 'success')
            return redirect(url_for('signin'))
        else:
            flash('User not found', 'error')
            return redirect(url_for('reset_password'))
    
    return render_template('new_password.html', email=email)


@app.route('/resend-otp', methods=['POST'])
def resend_otp():
    """AJAX endpoint to resend OTP with rate limiting"""
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    purpose = data.get('purpose', '')
    
    if not email or not purpose:
        return jsonify({'success': False, 'message': 'Invalid request'})
    
    # Rate limiting: Check if last OTP was sent within 60 seconds
    last_resend_key = f'last_resend_{email}_{purpose}'
    last_resend_time = session.get(last_resend_key)
    
    if last_resend_time:
        time_diff = (datetime.utcnow() - datetime.fromisoformat(last_resend_time)).total_seconds()
        if time_diff < 60:
            remaining = int(60 - time_diff)
            return jsonify({'success': False, 'message': f'Please wait {remaining} seconds before resending'})
    
    if purpose == 'signup_verification':
        pending = PendingRegistration.query.filter_by(email=email).first()
        if not pending:
            return jsonify({'success': False, 'message': 'Registration not found'})
        
        # Generate new OTP code and update the pending registration
        pending.otp_code = PendingRegistration.generate_otp()
        pending.created_at = datetime.utcnow()  # Reset expiry time
        db.session.commit()
        
        success, message = send_verification_email(email, pending.otp_code)
    else:
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'success': False, 'message': 'User not found'})
        
        otp = OTP.create_otp(user.id, purpose)
        
        if purpose == 'login':
            success, message = send_login_otp(email, otp.code)
        elif purpose == 'reset':
            success, message = send_reset_password_email(email, otp.code)
        else:
            return jsonify({'success': False, 'message': 'Invalid purpose'})
    
    if success:
        # Record resend time for rate limiting
        session[last_resend_key] = datetime.utcnow().isoformat()
        return jsonify({'success': True, 'message': 'OTP sent successfully'})
    else:
        return jsonify({'success': False, 'message': 'Failed to send OTP. Please try again.'})


@app.route('/signout')
def signout():
    session.clear()
    flash('You have been signed out', 'success')
    return redirect(url_for('home'))

@app.route('/profile')
@login_required
def profile():
    try:
        user = User.query.get(session['user_id'])
        if not user:
            # User no longer exists, clear session
            session.clear()
            flash('Your session has expired. Please sign in again.', 'error')
            return redirect(url_for('signin'))
        return render_template('profile.html', user=user)
    except Exception as e:
        # Handle database connection errors
        app.logger.error(f"Database error in profile: {e}")
        session.clear()
        flash('Database connection error. Please try signing in again.', 'error')
        return redirect(url_for('signin'))

@app.route('/change-password', methods=['POST'])
@login_required
def change_password():
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        flash('Your session has expired. Please sign in again.', 'error')
        return redirect(url_for('signin'))
    
    current_password = request.form.get('current_password', '')
    new_password = request.form.get('new_password', '')
    confirm_new_password = request.form.get('confirm_new_password', '')
    
    # Validate current password
    if not user.check_password(current_password):
        flash('Current password is incorrect', 'error')
        return redirect(url_for('profile'))
    
    # Validate new password
    if len(new_password) < 6:
        flash('New password must be at least 6 characters', 'error')
        return redirect(url_for('profile'))
    
    if new_password != confirm_new_password:
        flash('New passwords do not match', 'error')
        return redirect(url_for('profile'))
    
    # Update password
    user.set_password(new_password)
    user.updated_at = datetime.utcnow()
    db.session.commit()
    
    flash('Password changed successfully!', 'success')
    return redirect(url_for('profile'))

@app.route('/update-profile', methods=['POST'])
@login_required
def update_profile():
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        return jsonify({'success': False, 'message': 'Your session has expired. Please sign in again.', 'redirect': url_for('signin')})
    
    # Update only mobile field (phone number)
    mobile = request.form.get('mobile', '').strip()
    
    if mobile:
        # Validate mobile is 10 digits
        if not mobile.isdigit() or len(mobile) != 10:
            return jsonify({'success': False, 'message': 'Please enter a valid 10-digit mobile number'})
        user.mobile = mobile
    
    user.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Phone number updated successfully!'})

# ============== PAGE-BASED PROFILE SETTINGS ==============

@app.route('/settings/phone', methods=['GET', 'POST'])
@login_required
def change_phone_page():
    """Standalone page for changing phone number"""
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        flash('Your session has expired. Please sign in again.', 'error')
        return redirect(url_for('signin'))
    
    if request.method == 'POST':
        mobile = request.form.get('mobile', '').strip()
        
        if not mobile:
            flash('Please enter a phone number.', 'error')
            return render_template('change_phone.html', user=user)
        
        if not mobile.isdigit() or len(mobile) != 10:
            flash('Please enter a valid 10-digit mobile number.', 'error')
            return render_template('change_phone.html', user=user)
        
        user.mobile = mobile
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        flash('Phone number updated successfully!', 'success')
        return redirect(url_for('profile'))
    
    return render_template('change_phone.html', user=user)

@app.route('/settings/email', methods=['GET', 'POST'])
@login_required
def change_email_page():
    """Standalone page for changing email address"""
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        flash('Your session has expired. Please sign in again.', 'error')
        return redirect(url_for('signin'))
    
    if request.method == 'POST':
        new_email = request.form.get('new_email', '').strip().lower()
        password = request.form.get('password', '')
        
        if not new_email or not password:
            flash('Please fill in all fields.', 'error')
            return render_template('change_email.html', user=user)
        
        if not user.check_password(password):
            flash('Incorrect password.', 'error')
            return render_template('change_email.html', user=user)
        
        if new_email == user.email:
            flash('New email is the same as your current email.', 'error')
            return render_template('change_email.html', user=user)
        
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user:
            flash('This email is already in use.', 'error')
            return render_template('change_email.html', user=user)
        
        # Generate OTP and send to new email
        import random
        otp_code = str(random.randint(100000, 999999))
        
        session['pending_email_change'] = {
            'new_email': new_email,
            'otp_code': otp_code,
            'user_id': user.id
        }
        
        from .email_service import send_login_otp
        success, message = send_login_otp(new_email, otp_code)
        
        if success or app.debug:
            flash('Verification code sent to your new email!', 'success')
            return redirect(url_for('verify_email_change'))
        else:
            flash('Failed to send verification email. Please try again.', 'error')
            return render_template('change_email.html', user=user)
    
    return render_template('change_email.html', user=user)

@app.route('/settings/verify-email', methods=['GET', 'POST'])
@login_required
def verify_email_page():
    """Standalone page for initiating email verification"""
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        flash('Your session has expired. Please sign in again.', 'error')
        return redirect(url_for('signin'))
    
    if user.is_verified:
        flash('Your email is already verified.', 'info')
        return render_template('verify_email_page.html', user=user)
    
    if request.method == 'POST':
        # Generate OTP
        import random
        otp_code = str(random.randint(100000, 999999))
        
        session['pending_email_verification'] = {
            'email': user.email,
            'otp_code': otp_code,
            'user_id': user.id
        }
        
        from .email_service import send_login_otp
        success, message = send_login_otp(user.email, otp_code)
        
        if success or app.debug:
            flash('Verification code sent to your email!', 'success')
            return redirect(url_for('verify_current_email'))
        else:
            flash('Failed to send verification email. Please try again.', 'error')
            return render_template('verify_email_page.html', user=user)
    
    return render_template('verify_email_page.html', user=user)

@app.route('/change-email', methods=['POST'])
@login_required
def change_email():
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        return jsonify({'success': False, 'message': 'Your session has expired. Please sign in again.', 'redirect': url_for('signin')})
    
    new_email = request.form.get('new_email', '').strip().lower()
    password = request.form.get('password', '')
    
    if not new_email or not password:
        return jsonify({'success': False, 'message': 'Please fill in all fields'})
    
    # Verify password
    if not user.check_password(password):
        return jsonify({'success': False, 'message': 'Incorrect password'})
    
    # Check if email is same as current
    if new_email == user.email:
        return jsonify({'success': False, 'message': 'New email is the same as your current email'})
    
    # Check if email already exists
    existing_user = User.query.filter_by(email=new_email).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'This email is already in use'})
    
    # Generate OTP and send to new email
    import random
    otp_code = str(random.randint(100000, 999999))
    
    # Store the pending email change in session
    session['pending_email_change'] = {
        'new_email': new_email,
        'otp_code': otp_code,
        'user_id': user.id
    }
    
    # Send OTP to new email
    from .email_service import send_login_otp
    success, message = send_login_otp(new_email, otp_code)
    
    if success or app.debug:
        dev_otp = otp_code if app.debug else None
        return jsonify({
            'success': True, 
            'message': 'Verification code sent to your new email!',
            'redirect': url_for('verify_email_change'),
            'dev_otp': dev_otp
        })
    else:
        return jsonify({'success': False, 'message': 'Failed to send verification email. Please try again.'})

@app.route('/verify-email-change', methods=['GET', 'POST'])
@login_required
def verify_email_change():
    if 'pending_email_change' not in session:
        flash('No pending email change found.', 'error')
        return redirect(url_for('profile'))
    
    pending = session['pending_email_change']
    new_email = pending['new_email']
    dev_otp = pending['otp_code'] if app.debug else None
    
    if request.method == 'POST':
        otp_code = request.form.get('otp', '').strip()
        
        if otp_code == pending['otp_code']:
            # OTP is correct, update the email
            user = User.query.get(session['user_id'])
            if user:
                user.email = new_email
                user.is_verified = True  # Already verified since they got the OTP
                user.updated_at = datetime.utcnow()
                db.session.commit()
                
                # Clear pending email change
                session.pop('pending_email_change', None)
                
                flash('Email updated successfully!', 'success')
                return redirect(url_for('profile'))
            else:
                flash('User not found.', 'error')
                return redirect(url_for('signin'))
        else:
            flash('Invalid verification code. Please try again.', 'error')
            return render_template('verify_email_change.html',
                                   email=new_email,
                                   dev_otp=dev_otp)
    
    return render_template('verify_email_change.html',
                           email=new_email,
                           dev_otp=dev_otp)

@app.route('/cancel-email-change')
@login_required
def cancel_email_change():
    """Cancel a pending email change"""
    session.pop('pending_email_change', None)
    flash('Email change cancelled.', 'info')
    return redirect(url_for('profile'))

@app.route('/send-email-verification', methods=['POST'])
@login_required
def send_email_verification():
    """Send OTP to user's current email for verification"""
    user = User.query.get(session['user_id'])
    if not user:
        session.clear()
        return jsonify({'success': False, 'message': 'Session expired. Please sign in again.', 'redirect': url_for('signin')})
    
    if user.is_verified:
        return jsonify({'success': False, 'message': 'Your email is already verified.'})
    
    # Generate OTP
    import random
    otp_code = str(random.randint(100000, 999999))
    
    # Store in session
    session['pending_email_verification'] = {
        'email': user.email,
        'otp_code': otp_code,
        'user_id': user.id
    }
    
    # Send OTP to user's email
    from .email_service import send_login_otp
    success, message = send_login_otp(user.email, otp_code)
    
    if success or app.debug:
        dev_otp = otp_code if app.debug else None
        return jsonify({
            'success': True,
            'message': 'Verification code sent to your email!',
            'redirect': url_for('verify_current_email'),
            'dev_otp': dev_otp
        })
    else:
        return jsonify({'success': False, 'message': 'Failed to send verification email. Please try again.'})

@app.route('/verify-current-email', methods=['GET', 'POST'])
@login_required
def verify_current_email():
    """Verify user's current email with OTP"""
    if 'pending_email_verification' not in session:
        flash('No pending email verification found.', 'error')
        return redirect(url_for('profile'))
    
    pending = session['pending_email_verification']
    email = pending['email']
    dev_otp = pending['otp_code'] if app.debug else None
    
    if request.method == 'POST':
        otp_code = request.form.get('otp', '').strip()
        
        if otp_code == pending['otp_code']:
            # OTP is correct, verify the email
            user = User.query.get(session['user_id'])
            if user:
                # Make sure email hasn't changed since verification was initiated
                if user.email == pending['email']:
                    user.is_verified = True
                    user.updated_at = datetime.utcnow()
                    db.session.commit()
                    
                    # Clear pending verification
                    session.pop('pending_email_verification', None)
                    
                    flash('Email verified successfully!', 'success')
                    return redirect(url_for('profile'))
                else:
                    flash('Your email has changed. Please start verification again.', 'error')
                    session.pop('pending_email_verification', None)
                    return redirect(url_for('profile'))
            else:
                flash('User not found.', 'error')
                return redirect(url_for('signin'))
        else:
            flash('Invalid verification code. Please try again.', 'error')
            return render_template('verify_current_email.html',
                                   email=email,
                                   dev_otp=dev_otp)
    
    return render_template('verify_current_email.html',
                           email=email,
                           dev_otp=dev_otp)

@app.route('/delete-account')
@login_required
def delete_account():
    user = User.query.get(session['user_id'])
    if user:
        db.session.delete(user)
        db.session.commit()
    
    session.clear()
    flash('Your account has been deleted.', 'success')
    return redirect(url_for('home'))

@app.route('/payment')
def payment():
    return render_template('payment.html')


# ==================== GREAT STEP REGISTRATION ====================

def verified_user_required(f):
    """Decorator that requires user to be logged in AND email verified"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please sign in to access this page', 'error')
            return redirect(url_for('signin'))
        
        user = User.query.get(session['user_id'])
        if not user:
            session.clear()
            flash('Session expired. Please sign in again.', 'error')
            return redirect(url_for('signin'))
        
        if not user.is_verified:
            flash('Please verify your email before registering for Great Step.', 'warning')
            return redirect(url_for('profile'))
        
        return f(*args, **kwargs)
    return decorated_function


@app.route('/great-step/register', methods=['GET', 'POST'])
@verified_user_required
def greatstep_register():
    """Great Step event registration page"""
    user = User.query.get(session['user_id'])
    
    # Check if already registered
    if user.is_greatstep_registered:
        flash('You are already registered for Great Step!', 'info')
        return redirect(url_for('profile'))
    
    # Check if there's an existing registration with completed payment
    existing_reg = GreatStepRegistration.query.filter_by(
        email=user.email, 
        payment_status='completed'
    ).first()
    if existing_reg:
        # Update user flag if somehow out of sync
        user.is_greatstep_registered = True
        db.session.commit()
        flash('You are already registered for Great Step!', 'info')
        return redirect(url_for('profile'))
    
    if request.method == 'POST':
        # Get form data
        first_name = request.form.get('first_name', '').strip()
        last_name = request.form.get('last_name', '').strip()
        mobile = request.form.get('mobile', '').strip()
        college = request.form.get('college', '').strip()
        year = request.form.get('year', '').strip()
        
        # Validation
        if not all([first_name, last_name, mobile, college, year]):
            flash('Please fill in all required fields', 'error')
            return render_template('greatstep_register.html', user=user)
        
        if not mobile.isdigit() or len(mobile) != 10:
            flash('Please enter a valid 10-digit mobile number', 'error')
            return render_template('greatstep_register.html', user=user)
        
        # Prepare registration data
        amount = Config.GREATSTEP_REGISTRATION_FEE  # Amount in paise
        
        # Store registration data in session instead of DB
        session['pending_reg_data'] = {
            'email': user.email,
            'first_name': first_name,
            'last_name': last_name,
            'mobile': mobile,
            'college': college,
            'year': year,
            'amount_paid': amount,
            'payment_status': 'pending'
        }
        
        # Create a dict-like object or just pass the dict for the template
        # Jinja2 handles dicts with dot notation seamlessly
        registration_data = session['pending_reg_data']
        
        # Render payment page with UPI QR code
        return render_template('greatstep_payment.html',
                               user=user,
                               registration=registration_data,
                               amount_display=amount // 100)  # Convert paise to rupees for display
    
    return render_template('greatstep_register.html', user=user)


@app.route('/great-step/payment/verify', methods=['POST'])
@verified_user_required
def greatstep_payment_verify():
    """Verify Manual payment submission"""
    user = User.query.get(session['user_id'])
    
    # Get payment details from request
    transaction_id = request.form.get('transaction_id', '').strip()
    
    if not transaction_id:
        flash('Please enter the Transaction ID.', 'error')
        # We need to re-fetch registration to re-render the payment page properly if we were to redirect back
        # But simpler to just redirect to register which will redirect to payment if pending?
        # Actually register route creates new one. Let's redirect to a payment page route if we had one.
        # Since we don't have a standalone GET /payment route for a specific reg, we'll redirect to register
        # But wait, register create a NEW pending one. 
        # Let's try to find the pending one in `greatstep_register` GET logic? No it creates valid one on POST.
        # We should probably just redirect to register, user might have to re-enter details but that's safe.
        return redirect(url_for('greatstep_register'))
    
    # Retrieve pending registration data from session
    reg_data = session.get('pending_reg_data')
    
    if not reg_data or reg_data.get('email') != user.email:
        flash('Registration session expired. Please register again.', 'error')
        return redirect(url_for('greatstep_register'))
    
    # Check if registration already exists
    existing_registration = GreatStepRegistration.query.filter_by(email=user.email).first()
    
    if existing_registration:
        # Update existing record
        existing_registration.first_name = reg_data['first_name']
        existing_registration.last_name = reg_data['last_name']
        existing_registration.mobile = reg_data['mobile']
        existing_registration.college = reg_data['college']
        existing_registration.year = reg_data['year']
        existing_registration.amount_paid = reg_data['amount_paid']
        existing_registration.transaction_id = transaction_id
        existing_registration.payment_status = 'verification_pending'
        existing_registration.payment_completed_at = datetime.utcnow()
    else:
        # Create new record
        registration = GreatStepRegistration(
            email=reg_data['email'],
            first_name=reg_data['first_name'],
            last_name=reg_data['last_name'],
            mobile=reg_data['mobile'],
            college=reg_data['college'],
            year=reg_data['year'],
            amount_paid=reg_data['amount_paid'],
            transaction_id=transaction_id,
            payment_status='verification_pending',
            payment_completed_at=datetime.utcnow()
        )
        db.session.add(registration)
    
    db.session.commit()
    
    # specific cleanup
    session.pop('pending_reg_data', None)
    
    flash('Payment details submitted! Verification is pending.', 'success')
    return redirect(url_for('greatstep_payment_success'))


@app.route('/great-step/payment/success')
@verified_user_required
def greatstep_payment_success():
    """Payment success page"""
    user = User.query.get(session['user_id'])
    registration = GreatStepRegistration.query.filter_by(
        email=user.email
    ).filter(
        (GreatStepRegistration.payment_status == 'completed') | 
        (GreatStepRegistration.payment_status == 'verification_pending')
    ).order_by(GreatStepRegistration.created_at.desc()).first()
    
    return render_template('greatstep_success.html', user=user, registration=registration)


@app.route('/great-step/payment/failure')
@verified_user_required
def greatstep_payment_failure():
    """Payment failure page"""
    return render_template('greatstep_failure.html')


# Production readiness: Logging and Error Handling
import logging

if not app.debug:
    # Set up logging for production (console logging for serverless)
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)
    app.logger.info('GreatStep startup')

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('error_404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('error_500.html'), 500

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('error_403.html'), 403





if __name__ == '__main__':
    app.run(debug=True)
