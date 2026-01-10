from flask import Flask, render_template, redirect, url_for, flash, request
from .events_data import get_event_data, EVENTS_DATA

app = Flask(__name__)
app.secret_key = 'your-secret-key-here-change-in-production'

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
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        # TODO: Add actual authentication logic here
        # For now, just flash a message
        flash('Login functionality will be connected to backend later', 'info')
    return render_template('signin.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        cpassword = request.form.get('cpassword')
        referral = request.form.get('referral')
        # TODO: Add actual registration logic here
        if password != cpassword:
            flash('Passwords do not match', 'error')
        else:
            flash('Registration functionality will be connected to backend later', 'info')
    return render_template('signup.html')

@app.route('/resetPassword', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        email = request.form.get('email')
        # TODO: Add actual password reset logic here
        flash('Password reset email will be sent once backend is connected', 'info')
    return render_template('reset_password.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/payment')
def payment():
    return render_template('payment.html')

if __name__ == '__main__':
    app.run(debug=True)
