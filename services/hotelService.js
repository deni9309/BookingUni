const Hotel = require('../models/Hotel');
const User = require('../models/User');

exports.getAll = () => Hotel.find({}).lean();

exports.getById = (id) => {
    return Hotel.findById(id).lean();
};

exports.getByIdWithBookings = async (id) => {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
        throw new Error('Sorry, hotel you\'re looking for couldn\'t be found!');
    }

    await hotel.populate('bookings', '_id email username').lean();

    return hotel;
};

exports.getByOwnerId = async (ownerId) => {
    if (User.findById(ownerId) == undefined) {
        throw new Error('Could not find owner with id: ' + ownerId);
    }

    const hotels = await Hotel.find({ owner: ownerId }).lean();

    return hotels;
};

exports.create = async (userId, hotelData) => {
    const isNameTaken = await Hotel.findOne({ name: hotelData.name });
    if (isNameTaken) {
        throw new Error('Sorry, hotel with the same name already exists! Please, provide an unique one.');
    }

    const hotel = {
        name: hotelData.name,
        city: hotelData.city,
        imgUrl: hotelData.imgUrl,
        rooms: Number(hotelData.rooms),
        owner: userId,
    };

    await Hotel.create(hotel);
};

exports.edit = async (id, hotelData) => {
    const hotel = await Hotel.findById(id);
    if (hotel) {
        const nameEncounters = await Hotel.find({ name: hotelData.name });
        if (nameEncounters.length > 1) {
            throw new Error('Sorry, hotel with the same name already exists! Please, provide an unique one.');
        }

        hotel.name = hotelData.name;
        hotel.city = hotelData.city;
        hotel.imgUrl = hotelData.imgUrl;
        hotel.rooms = Number(hotelData.rooms);

        await hotel.save();
        return hotel._id;
    } else {
        return undefined;
    }
};

exports.isOwner = async (userId, hotelId) => {
    const hotel = await this.getById(hotelId);

    const isOwner = hotel.owner == userId;
    if (isOwner) {
        return true;
    }

    return false;
};

exports.book = async (hotelId, userId) => {
    await Hotel.updateOne(
        { $and: [{ _id: hotelId }, { bookings: { $ne: userId } }] },
        { $push: { bookings: userId } }
    ).exec();

    // if ((await this.getById(hotelId)).bookings.includes(userId)) {
    //     throw new Error('Cannot book twice!');
    // }
};

exports.getBookedHotelsForUser = async (userId) => {
    const bookings = (await Hotel.find({ bookings: { $eq: userId } })).map(h => h.name);

    return bookings;
}

exports.deleteById = (hotelId) => Hotel.findByIdAndDelete(hotelId).exec();