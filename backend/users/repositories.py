from .models import MyUser

class UserRepository:
    @staticmethod
    def get_all():
        return MyUser.objects.all()

    @staticmethod
    def get_by_id(user_id):
        return MyUser.objects.get(id=user_id)

    @staticmethod
    def create(data):
        password = data.pop('password', None)
        user = MyUser(**data)
        if password:
            user.set_password(password)
        user.save()
        return user

    @staticmethod
    def delete(user):
        user.delete()
        return user

    @staticmethod
    def update(user, data):
        for attr, value in data.items():
            setattr(user, attr, value)
        user.save()
        return user
