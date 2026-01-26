from app import app, db, User
import sys

def set_admin(email):
    print(f"Attempting to promote user: {email}")
    with app.app_context():
        # Case-insensitive email search
        user = User.query.filter(User.email.ilike(email)).first()
        
        if not user:
            print(f"❌ Error: User with email '{email}' not found in the database.")
            print("   Please sign up with this email first.")
            return
        
        if user.is_admin:
            print(f"ℹ️  User '{email}' is already an Admin.")
            return

        try:
            user.is_admin = True
            db.session.commit()
            print(f"✅ Success: User '{email}' has been promoted to Admin.")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error updating database: {e}")

if __name__ == "__main__":
    target_email = "johndoe@abc.com"
    
    # Allow command line argument override
    if len(sys.argv) > 1:
        target_email = sys.argv[1]
        
    set_admin(target_email)
