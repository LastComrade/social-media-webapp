const CloseFriend = ({ user }) => {
  return (
    <li className="flex items-center hover:bg-indigo-700 px-3 py-2 duration-100 hover:text-white cursor-pointer">
      <img className="h-10 w-10 rounded-full object-cover" src={user.profilePicture} alt="" />
      <span className="ml-3">{user.username}</span>
    </li>
  );
};

export default CloseFriend;
