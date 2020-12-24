const userSerializer = (object) => ({
  id: object.id,
  email: object.email,
  role: object.role,
  fullName: object.fullName,
  birthday: object.birthday,
  createdAt: object.createdAt,
  updatedAt: object.updatedAt,
});

const userCollectionSerializer = (objects) => objects.map((object) => userSerializer(object));

module.exports = {
  userSerializer,
  userCollectionSerializer,
};
