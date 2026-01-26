from app import app, db, User, GreatStepRegistration
from datetime import datetime

def verify_payment():
    """Interactive script to verify payments"""
    print("="*50)
    print("      Great Step Payment Verification Tool")
    print("="*50)
    
    while True:
        print("\nOptions:")
        print("1. Verify a Transaction")
        print("2. List Pending Verifications")
        print("3. Exit")
        
        choice = input("\nEnter choice (1-3): ").strip()
        
        if choice == '3':
            break
            
        if choice == '2':
            with app.app_context():
                pending = GreatStepRegistration.query.filter_by(payment_status='verification_pending').all()
                if not pending:
                    print("\nNo pending verifications found.")
                else:
                    print(f"\nFound {len(pending)} pending payments:")
                    print(f"{'ID':<5} {'Name':<20} {'Email':<30} {'Transaction ID':<20}")
                    print("-" * 80)
                    for reg in pending:
                        print(f"{reg.id:<5} {reg.first_name + ' ' + reg.last_name:<20} {reg.email:<30} {reg.transaction_id:<20}")
            continue
            
        if choice == '1':
            txn_id = input("\nEnter Transaction ID to verify: ").strip()
            if not txn_id:
                print("Error: Transaction ID cannot be empty.")
                continue
                
            with app.app_context():
                # Find registration by transaction ID (flexible search)
                reg = GreatStepRegistration.query.filter(GreatStepRegistration.transaction_id.ilike(txn_id)).first()
                
                if not reg:
                    print(f"\n❌ No registration found with Transaction ID: {txn_id}")
                    continue
                
                print(f"\nFound Registration:")
                print(f"Name: {reg.first_name} {reg.last_name}")
                print(f"Email: {reg.email}")
                print(f"Status: {reg.payment_status}")
                print(f"Amount: ₹{reg.amount_paid // 100}")
                
                if reg.payment_status == 'completed':
                    print("\n⚠️  This payment is already verified!")
                    continue
                
                confirm = input("\nVerify this payment? (y/n): ").lower()
                
                if confirm == 'y':
                    try:
                        # Update registration
                        reg.payment_status = 'completed'
                        reg.payment_completed_at = datetime.utcnow()
                        
                        # Update user status
                        user = User.query.filter_by(email=reg.email).first()
                        if user:
                            user.is_greatstep_registered = True
                            user.updated_at = datetime.utcnow()
                            print(f"[INFO] User {user.email} marked as registered.")
                        else:
                            print(f"[WARN] Linked user account not found for {reg.email}")
                            
                        db.session.commit()
                        print(f"\n✅ Payment verified successfully!")
                        
                    except Exception as e:
                        db.session.rollback()
                        print(f"\n❌ Error updating database: {e}")
                else:
                    print("Cancelled.")

if __name__ == "__main__":
    verify_payment()
