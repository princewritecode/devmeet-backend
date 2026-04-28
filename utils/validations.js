const validateEditProfileData = async (req) =>
{
    // const loggedInUser = req.user;
    // console.log(loggedInUser);
    try
    {

        let allowedEditFields = ["firstName", "lastName", "gender", "photoUrl", "about", "skills"];
        const isEditAllowed = Object.keys(req.body).every((e) =>
        {
            return allowedEditFields.includes(e);
        });

        return isEditAllowed;
    }
    catch (err)
    {

    }
};

module.exports = validateEditProfileData;