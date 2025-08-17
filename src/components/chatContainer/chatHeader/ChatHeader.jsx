import { X } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";

const ChatHeader = () => {
  const { selectedFriend, setSelectedFriend } = useChatStore();
  const { onlineFriends } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedFriend.profilePicture} alt={selectedFriend.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedFriend.firstName + " " + selectedFriend.lastName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineFriends.includes(selectedFriend._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedFriend(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;