from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import Review, Comment, Follow

reviews = Blueprint('reviews', __name__)


@reviews.route('/', methods=['POST'])
@jwt_required()
def create_review():
    data = request.get_json()
    book_name = data.get('book_name')
    isbn = data.get('isbn')
    author_name = data.get('author_name')
    review_text = data.get('review_text')

    if not book_name or not review_text:
        return jsonify({'message': 'Book name and review text are required'}), 400

    user_id = get_jwt_identity()
    new_review = Review(
        book_name=book_name,
        isbn=isbn,
        author_name=author_name,
        review_text=review_text,
        user_id=user_id
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({'message': 'Review created successfully', 'review': {
        'id': new_review.id,
        'book_name': new_review.book_name,
        'isbn': new_review.isbn,
        'author_name': new_review.author_name,
        'review_text': new_review.review_text,
        'user_id': new_review.user_id
    }}), 201


@reviews.route('/<int:review_id>', methods=['GET'])
@jwt_required()
def get_review(review_id):
    review = Review.query.get_or_404(review_id)
    return jsonify({
        'id': review.id,
        'book_name': review.book_name,
        'isbn': review.isbn,
        'author_name': review.author_name,
        'review_text': review.review_text,
        'user_id': review.user_id
    })


@reviews.route('/', methods=['GET'])
@jwt_required()
def get_all_reviews():
    current_user_id = get_jwt_identity()

    followed_user_ids = db.session.query(Follow.followed_id).filter_by(follower_id=current_user_id).all()
    followed_user_ids = {f[0] for f in followed_user_ids}
    followed_user_ids.add(current_user_id)

    reviews = Review.query.filter(Review.user_id.in_(followed_user_ids)).all()

    reviews_list = [{
        'id': review.id,
        'book_name': review.book_name,
        'isbn': review.isbn,
        'author_name': review.author_name,
        'review_text': review.review_text,
        'user': review.user.username
    } for review in reviews]

    return jsonify({'reviews': reviews_list}), 200


@reviews.route('/<int:review_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(review_id):
    data = request.get_json()
    comment_text = data.get('comment_text')

    if not comment_text:
        return jsonify({'message': 'Comment text is required'}), 400

    user_id = get_jwt_identity()
    review = Review.query.get_or_404(review_id)

    new_comment = Comment(
        comment_text=comment_text,
        review_id=review_id,
        user_id=user_id
    )
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment added successfully', 'comment': {
        'id': new_comment.id,
        'comment_text': new_comment.comment_text,
        'review_id': new_comment.review_id,
        'user_id': new_comment.user_id
    }}), 201


@reviews.route('/<int:review_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(review_id):
    review = Review.query.get_or_404(review_id)
    comments = review.comments
    comments_list = [{
        'id': comment.id,
        'comment_text': comment.comment_text,
        'user': comment.user.username
    } for comment in comments]

    response = {
        'review': {
            'id': review.id,
            'book_name': review.book_name,
            'isbn': review.isbn,
            'author_name': review.author_name,
            'review_text': review.review_text,
            'user': review.user.username
        },
        'comments': comments_list
    }

    return jsonify(response), 200
