"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // disallow null -> need to have valid data formatted like in type (will not accept empty responses)
        validate: {
          notNull: {
            msg: 'Please provide a value for "title"'
          },
          notEmpty: {
            msg: 'Please provide a value for "title"'
          }
        }
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false, // disallow null -> need to have valid data formatted like in type (will not accept empty responses)
        validate: {
          notNull: {
            msg: 'Please provide a value for "author"'
          },
          notEmpty: {
            //Will not allow for user to submit if the input is empty
            msg: 'Please provide a value for "author"'
          }
        }
      },
      genre: DataTypes.STRING,
      year: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Book"
    }
  );
  return Book;
};
