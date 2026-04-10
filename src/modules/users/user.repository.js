const prisma = require('../../config/prisma');

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

const addressSelect = {
  id: true,
  label: true,
  line1: true,
  line2: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
};

const findUserById = (userId) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: safeUserSelect,
  });

const updateUser = (userId, data) =>
  prisma.user.update({
    where: { id: userId },
    data,
    select: safeUserSelect,
  });

const findAddressesByUserId = (userId) =>
  prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    select: addressSelect,
  });

const findAddressByIdAndUserId = (addressId, userId) =>
  prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
    select: addressSelect,
  });

const createAddress = async (userId, data) =>
  prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return tx.address.create({
      data: {
        ...data,
        userId,
      },
      select: addressSelect,
    });
  });

const updateAddress = async (addressId, userId, data) =>
  prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return tx.address.update({
      where: { id: addressId },
      data,
      select: addressSelect,
    });
  });

const deleteAddress = (addressId) =>
  prisma.address.delete({
    where: { id: addressId },
    select: addressSelect,
  });

module.exports = {
  findUserById,
  updateUser,
  findAddressesByUserId,
  findAddressByIdAndUserId,
  createAddress,
  updateAddress,
  deleteAddress,
};
