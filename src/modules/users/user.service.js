const ApiError = require('../../utils/ApiError');
const userRepository = require('./user.repository');

const getProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

const updateProfile = async (userId, data) => {
  await getProfile(userId);

  return userRepository.updateUser(userId, data);
};

const getAddresses = async (userId) => userRepository.findAddressesByUserId(userId);

const createAddress = async (userId, data) => userRepository.createAddress(userId, data);

const updateAddress = async (userId, addressId, data) => {
  const address = await userRepository.findAddressByIdAndUserId(addressId, userId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  return userRepository.updateAddress(addressId, userId, data);
};

const deleteAddress = async (userId, addressId) => {
  const address = await userRepository.findAddressByIdAndUserId(addressId, userId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  return userRepository.deleteAddress(addressId);
};

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
