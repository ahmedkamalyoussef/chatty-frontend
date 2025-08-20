import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import SidebarSkeleton from "./sidebarSkeleton/SidebarSkeleton";
import { Users, ChevronRight, ChevronLeft } from "lucide-react";
import { useFriendsStore } from "../../store/useFriendsStore";

const Sidebar = () => {
  const { selectedFriend, setSelectedFriend } = useChatStore();
  const { onlineFriends, getFriends, friends, isFriendsLoading } = useFriendsStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 👈 toggle للشاشات الصغيرة

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const filteredFriends = showOnlineOnly
    ? friends.filter((friend) => onlineFriends.includes(friend._id))
    : friends;

  if (isFriendsLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        h-full border-r border-base-300 flex flex-col transition-all duration-300 overflow-hidden
        ${isExpanded ? "w-56" : "w-20"} lg:w-72
      `}
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
          <span className="font-medium hidden sm:block lg:hidden">
            {isExpanded ? "Contacts" : ""}
          </span>
        </div>

        {/* زرار toggle للشاشات الصغيرة */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="md:hidden btn btn-xs btn-ghost "
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Online filter - يظهر بس في الشاشات الكبيرة */}
      <div className={`mt-3   items-center gap-2 px-4 ${isExpanded?"flex":"hidden"}  `}>
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Show online only</span>
        </label>
        <span className="text-xs text-zinc-500">
          ({onlineFriends.length - 1} online)
        </span>
      </div>

      {/* Friends List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredFriends.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedFriend(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedFriend?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineFriends.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* لو الشاشة صغيرة + expanded => أظهر الاسم */}
            {(isExpanded || window.innerWidth >= 1024) && (
              <div className="text-left  min-w-0">
                <div className="font-medium  truncate">
                  {user.firstName + " " + user.lastName}
                </div>
                <div className="text-sm text-zinc-400 ">
                  {onlineFriends.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            )}
          </button>
        ))}

        {filteredFriends.length === 0 && (
          <div className="text-center text-zinc-500 py-4">Not online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
