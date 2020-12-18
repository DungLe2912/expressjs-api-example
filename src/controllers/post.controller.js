const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const Pagination = require('../utils/pagination');
const Post = require('../models/post.model');
const { postSerializer, postCollectionSerializer } = require('../serializers/post.serializer');

exports.listPost = async (req, res, next) => {
  try {
    const { limit, page } = Pagination.paginate(
      req.query.limit,
      req.query.page,
    );
    const totalPosts = await Post.countDocuments();
    const posts = await Post.find().skip((page - 1) * limit).limit(limit);
    res.json({
      posts: postCollectionSerializer(posts),
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();

    res.json({
      post: postSerializer(savedPost),
    });
  } catch (error) {
    next(error);
  }
};

exports.showPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Post not found',
      });
    }
    res.json({
      post: postSerializer(post),
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate({
      _id: req.params.id,
    }, req.body, { new: true });

    res.json({
      post: postSerializer(post),
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndRemove({ _id: req.params.id });

    res.json({
      post: postSerializer(post),
    });
  } catch (error) {
    next(error);
  }
};
