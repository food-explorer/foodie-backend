import IUserModel, { User } from '../database/models/user.model';
import ApiError from '../utilities/ApiError';
import httpStatus from 'http-status';

const getProfile = async (profile: IUserModel) => {
  try {
    const { image, header, bio, firstName, lastName } = profile;
    // get the persons 10 most recent posts;
    return {
      username: profile.username,
      firstName,
      lastName,
      image,
      header,
      bio,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid Request, please try again'
    );
  }
};

const updateProfile = async (
  profile: IUserModel,
  body: { firstName?: string; lastName?: string; bio?: string }
) => {
  try {
    const user = await User.findOne({ username: profile.username });
    Object.keys(body).forEach((item: 'firstName' | 'lastName' | 'bio') => {
      user[item] = body[item];
    });

    await user.save();

    const { image, header, bio, firstName, lastName } = user;
    return {
      username: profile.username,
      firstName,
      lastName,
      image,
      header,
      bio,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Unable to find user, please try again`
    );
  }
};

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

export { viewUser, followUser, unfollowUser, getProfile, updateProfile };
