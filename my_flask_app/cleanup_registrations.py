
from datetime import datetime
from app import app, db, GreatStepRegistration
from sqlalchemy import or_
import sys

def cleanup_records(force=False):
    print(f"[INFO] Starting safe cleanup process at {datetime.now()}")
    
    with app.app_context():
        # 1. Identify Invalid Records
        # Logic: Status is 'pending' OR (TransactionID IS NULL/Empty AND RazorpayID IS NULL/Empty)
        invalid_query = GreatStepRegistration.query.filter(
            or_(
                GreatStepRegistration.payment_status == 'pending',
                (
                    (GreatStepRegistration.transaction_id == None) | (GreatStepRegistration.transaction_id == '')
                )
            )
        )
        
        records = invalid_query.all()
        count = len(records)
        
        if count == 0:
            msg = "No invalid records found. Database is clean."
            print(f"[INFO] {msg}")
            return 0, msg

        print(f"[INFO] Found {count} invalid records.")

        # 3. Delete Records
        # Check if running interactively or forced
        if not force and '--force' not in sys.argv:
            try:
                confirmation = input(f"Are you sure you want to delete these {count} records? (yes/no): ")
                if confirmation.lower().strip() != 'yes':
                    msg = "Deletion cancelled by user."
                    print(f"[ABORT] {msg}")
                    return 0, msg
            except EOFError:
                msg = "Input stream closed. Use --force or call with force=True."
                print(f"[ERROR] {msg}")
                return 0, msg
        else:
             print("[INFO] Force mode detected. Skipping manual confirmation.")

        try:
            for reg in records:
                db.session.delete(reg)
            
            db.session.commit()
            msg = f"Successfully deleted {count} records from database."
            print(f"[SUCCESS] {msg}")
            return count, msg
            
        except Exception as e:
            db.session.rollback()
            msg = f"Database deletion failed: {e}"
            print(f"[ERROR] {msg}")
            return 0, msg

if __name__ == "__main__":
    cleanup_records()
