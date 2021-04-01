import IUserModel, { User } from '../database/models/user.model';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';

const viewUser = async (username: string, profile: IUserModel) => {
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      throw new Error(`Unable to find user: ${username}, please try again`);
    }
    const { image, header, bio, firstName, lastName } = foundUser;
    const following = profile.isFollowing(foundUser.id);
    // get the persons 10 most recent posts;
    return {
      user: {
        username: foundUser.username,
        firstName,
        lastName,
        image,
        header,
        bio,
      },
      following,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Unable to find user: ${username}, please try again`
    );
  }
};

const followUser = async (username: string, user: IUserModel) => {
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      throw new Error(`Unable to find user: ${username}, please try again`);
    }
    if (username === user.username) {
      throw new Error('You cannot follow yourself');
    }
    await user.follow(foundUser.id);
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error.message || 'Unable to process request, please try again'
    );
  }
};

const unfollowUser = async (username: string, user: IUserModel) => {
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      throw new Error(`Unable to find user: ${username}, please try again`);
    }
    if (username === user.username) {
      throw new Error('Invalid request');
    }
    await user.unfollow(foundUser.id);
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error.message || 'Unable to process request, please try again'
    );
  }
};

export { viewUser, followUser, unfollowUser };
