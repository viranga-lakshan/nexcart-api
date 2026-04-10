const { sendSuccess } = require('../../utils/apiResponse');
const userService = require('./user.service');

const getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user.sub);

  return sendSuccess(res, {
    message: 'Profile fetched successfully',
    data: user,
  });
};

const updateProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.sub, req.validated.body);

  return sendSuccess(res, {
    message: 'Profile updated successfully',
    data: user,
  });
};

const getAddresses = async (req, res) => {
  const addresses = await userService.getAddresses(req.user.sub);

  return sendSuccess(res, {
    message: 'Addresses fetched successfully',
    data: addresses,
    meta: {
      count: addresses.length,
    },
  });
};

const createAddress = async (req, res) => {
  const address = await userService.createAddress(req.user.sub, req.validated.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Address created successfully',
    data: address,
  });
};

const updateAddress = async (req, res) => {
  const address = await userService.updateAddress(
    req.user.sub,
    req.validated.params.addressId,
    req.validated.body
  );

  return sendSuccess(res, {
    message: 'Address updated successfully',
    data: address,
  });
};

const deleteAddress = async (req, res) => {
  await userService.deleteAddress(req.user.sub, req.validated.params.addressId);

  return sendSuccess(res, {
    message: 'Address deleted successfully',
    data: null,
  });
};

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
