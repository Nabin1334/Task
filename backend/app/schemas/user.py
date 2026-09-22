def user_data(user):
    return {"id": user.id, "email": user.email, "name": user.get_full_name() or user.username}