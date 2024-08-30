from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import User, Follow

people = Blueprint('people', __name__)


@people.route('/', methods=['GET'])
@jwt_required()
def get_people():
    current_user_id = get_jwt_identity()

    users = User.query.filter(User.id != current_user_id).all()
    followed_user_ids = db.session.query(Follow.followed_id).filter_by(follower_id=current_user_id).all()
    followed_user_ids = {f[0] for f in followed_user_ids}

    people_list = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_followed': user.id in followed_user_ids
    } for user in users]

    return jsonify({'people': people_list}), 200


@people.route('/follow/<int:user_id>', methods=['POST'])
@jwt_required()
def follow_user(user_id):
    current_user_id = get_jwt_identity()
    user_to_follow = User.query.get_or_404(user_id)

    if user_to_follow.id == current_user_id:
        return jsonify({'message': "You cannot follow yourself"}), 400

    follow = Follow.query.filter_by(follower_id=current_user_id, followed_id=user_id).first()

    if follow:
        return jsonify({'message': "You are already following this user"}), 400

    new_follow = Follow(follower_id=current_user_id, followed_id=user_id)
    db.session.add(new_follow)
    db.session.commit()

    return jsonify({'message': f'You are now following {user_to_follow.username}'}), 201


@people.route('/unfollow/<int:user_id>', methods=['POST'])
@jwt_required()
def unfollow_user(user_id):
    current_user_id = get_jwt_identity()
    follow = Follow.query.filter_by(follower_id=current_user_id, followed_id=user_id).first()

    if not follow:
        return jsonify({'message': "You are not following this user"}), 400

    db.session.delete(follow)
    db.session.commit()

    return jsonify({'message': "You have unfollowed this user"}), 200
