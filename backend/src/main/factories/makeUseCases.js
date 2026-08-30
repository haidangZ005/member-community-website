const env = require('../../infrastructure/config/env');
const RegisterUser = require('../../application/use-cases/auth/RegisterUser');
const LoginUser = require('../../application/use-cases/auth/LoginUser');
const RefreshSession = require('../../application/use-cases/auth/RefreshSession');
const LogoutUser = require('../../application/use-cases/auth/LogoutUser');
const ForgotPassword = require('../../application/use-cases/auth/ForgotPassword');
const ResetPassword = require('../../application/use-cases/auth/ResetPassword');
const UpdateProfile = require('../../application/use-cases/auth/UpdateProfile');
const GetProfile = require('../../application/use-cases/users/GetProfile');
const CreatePost = require('../../application/use-cases/posts/CreatePost');
const ListPosts = require('../../application/use-cases/posts/ListPosts');
const GetPostDetail = require('../../application/use-cases/posts/GetPostDetail');
const EditPost = require('../../application/use-cases/posts/EditPost');
const DeletePost = require('../../application/use-cases/posts/DeletePost');
const LikePost = require('../../application/use-cases/posts/LikePost');
const UnlikePost = require('../../application/use-cases/posts/UnlikePost');
const CreateComment = require('../../application/use-cases/comments/CreateComment');
const ListCommentsByPost = require('../../application/use-cases/comments/ListCommentsByPost');

function makeUseCases(dependencies) {
  const {
    userRepository, refreshTokenRepository, resetTokenRepository, hashService, tokenService, emailService,
    postRepository, commentRepository, likeRepository, categoryRepository,
  } = dependencies;
  return {
    registerUser: new RegisterUser({ userRepository, hashService }),
    loginUser: new LoginUser({ userRepository, hashService, tokenService, refreshTokenRepository }),
    refreshSession: new RefreshSession({ userRepository, tokenService, refreshTokenRepository }),
    logoutUser: new LogoutUser({ refreshTokenRepository, tokenService }),
    forgotPassword: new ForgotPassword({ userRepository, resetTokenRepository, tokenService, emailService, clientUrl: env.CLIENT_URL }),
    resetPassword: new ResetPassword({ userRepository, resetTokenRepository, refreshTokenRepository, hashService, tokenService }),
    updateProfile: new UpdateProfile({ userRepository }),
    getProfile: new GetProfile({ userRepository }),
    createPost: new CreatePost({ postRepository, categoryRepository }),
    listPosts: new ListPosts({ postRepository }),
    getPostDetail: new GetPostDetail({ postRepository }),
    editPost: new EditPost({ postRepository, categoryRepository }),
    deletePost: new DeletePost({ postRepository }),
    likePost: new LikePost({ postRepository, likeRepository }),
    unlikePost: new UnlikePost({ postRepository, likeRepository }),
    createComment: new CreateComment({ postRepository, commentRepository }),
    listCommentsByPost: new ListCommentsByPost({ postRepository, commentRepository }),
  };
}

module.exports = makeUseCases;
