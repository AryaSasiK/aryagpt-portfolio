"use client"

import type React from "react"

import { useState } from "react"
import { Plus, User, Linkedin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onNewChat?: () => void
  chats?: Array<{ id: number; title: string; date: string }>
  onChatSelected?: (chatId: number) => void
}

export default function Sidebar({ isOpen, onNewChat, chats = [], onChatSelected }: SidebarProps) {
  const [localChats, setLocalChats] = useState<Array<{ id: number; title: string; date: string }>>([])
  const router = useRouter()

  // Combine local chats with passed-in chats
  const allChats = [...chats, ...localChats]

  const addNewChat = () => {
    // Reset the chat to clear any existing messages
    if (onNewChat) {
      onNewChat()
    }
    
    // No longer adding a new chat to the sidebar list since we only want to go to landing page
  }

  const resetToLandingPage = () => {
    // First reset the chat to clear any existing messages
    if (onNewChat) {
      onNewChat()
    }
    
    // In a real app with multiple pages, we might navigate here
    // but for now we just need to reset the chat interface
  }

  const handleChatClick = (chatId: number) => {
    if (onChatSelected) {
      onChatSelected(chatId)
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-sidebar text-sidebar-foreground flex flex-col overflow-hidden transition-all ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        outline: 'none',
        WebkitAppearance: 'none'
      }}
    >
      {/* Top section with new chat button and main nav - this stays fixed */}
      <div className="flex-none">
        {/* New chat button */}
        <div className="p-3 flex items-center gap-3">
          <button
            onClick={addNewChat}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-sidebar-accent transition-colors w-full text-sidebar-foreground"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-sidebar-foreground"
            >
              <path
                d="M280.489105,654.507812 C294.240997,677.479675 313.890808,691.244934 340.140717,695.098022 C346.371460,696.012512 352.713715,696.595032 359.005463,696.601746 C448.490723,696.697327 537.976257,696.778076 627.461304,696.611877 C661.912292,696.547852 689.147766,682.920044 706.207703,652.039917 C712.559631,640.542236 715.807190,628.068726 715.730408,614.732727 C715.563538,585.738464 715.642212,556.742493 715.713196,527.747437 C715.735718,518.529785 719.617493,511.363708 727.829468,506.825317 C736.208984,502.194305 744.462036,502.866821 752.425537,507.803802 C758.907532,511.822266 762.119568,518.167969 762.173096,525.433044 C762.413574,558.092224 763.180603,590.789673 761.936401,623.403809 C760.984314,648.358521 751.696960,671.086792 736.218201,690.927734 C717.030396,715.523193 692.882507,732.556091 661.824646,738.696472 C653.997437,740.244080 646.097473,741.293823 638.075439,741.291809 C541.257996,741.267395 444.437317,741.738037 347.624451,741.070923 C301.475708,740.752991 266.593292,718.922241 242.667694,679.724731 C229.955994,658.898987 224.581360,636.004822 224.622955,611.625122 C224.755463,533.971680 224.435928,456.316895 224.784103,378.664825 C224.935242,344.961395 237.137680,315.612976 260.222809,290.994904 C279.241638,270.713104 302.398193,257.583160 329.766388,252.321899 C337.246002,250.884033 344.845612,249.748627 352.522003,249.743134 C375.351501,249.726807 398.181824,249.630798 421.010193,249.793839 C434.362671,249.889191 443.494232,257.412323 446.017517,269.813232 C448.860443,283.784973 437.761292,297.115692 422.839569,297.219330 C399.344574,297.382477 375.845123,297.483856 352.352142,297.214081 C326.237793,296.914246 305.875183,307.996735 289.608612,327.732605 C274.786011,345.716583 269.740967,366.638977 269.852234,389.561554 C270.223480,466.044281 270.143494,542.529114 270.382324,619.012695 C270.421509,631.560303 274.229095,643.243958 280.489105,654.507812"
                fill="currentColor"
              />
              <path
                d="M408.025208,456.300507 C413.389832,436.279999 423.578247,419.662262 437.955475,405.321594 C495.283997,348.138885 552.274048,290.615387 609.818787,233.651855 C626.355713,217.282043 646.647766,208.101669 670.432007,206.505707 C716.520996,203.413101 755.727783,229.816238 771.106750,270.289368 C784.025024,304.286469 778.565186,336.316162 755.243225,364.354980 C739.148376,383.705078 720.147705,400.376160 702.307556,418.103027 C678.800537,441.460876 655.222534,464.744202 631.948975,488.337860 C614.523987,506.002472 596.718750,523.292786 579.036499,540.702759 C561.282532,558.183411 539.203552,567.579407 515.719238,574.229370 C486.748230,582.432861 457.372589,588.887085 427.697357,593.934875 C419.531036,595.323975 411.233368,596.765137 403.069580,593.600281 C388.110291,587.801147 381.322449,573.878235 385.251801,556.377075 C392.716492,523.129761 400.344208,489.919067 408.025208,456.300507 M647.237610,262.728516 C645.059814,264.532318 642.719543,266.173462 640.727966,268.163574 C583.806763,325.042755 526.932434,381.968842 470.016113,438.852875 C461.306641,447.557404 455.607880,457.909088 452.442535,469.729919 C446.638245,491.405670 442.504272,513.470825 437.168579,535.250671 C435.554535,541.839172 438.734344,545.026184 445.473969,543.457031 C454.050446,541.460205 462.680817,539.684387 471.223206,537.553711 C487.354736,533.530029 503.368774,529.080322 519.155823,523.833801 C536.545227,518.054810 549.216309,505.678314 561.774414,493.251709 C585.458862,469.815216 608.955444,446.188751 632.518188,422.629364 C659.968079,395.183472 687.463806,367.783020 714.820374,340.244415 C726.453918,328.533478 732.913147,314.456635 730.322021,297.765808 C724.256226,258.693390 680.862732,240.211502 647.237610,262.728516"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm">New chat</span>
          </button>
        </div>

        {/* Main navigation links */}
        <div className="px-2 py-2">
          <nav className="space-y-1">
            <button
              onClick={resetToLandingPage}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-sidebar-foreground w-full text-left"
            >
              <span className="flex-shrink-0"><User size={16} /></span>
              <span className="text-sm truncate">AryaGPT</span>
            </button>
            <NavItem
              icon={<Linkedin size={16} />}
              label="LinkedIn"
              href="https://www.linkedin.com/in/aryasasikumar/"
              external
            />
            <NavItem icon={<Phone size={16} />} label="Phone Number" href="tel:925-872-3787" external />
            <NavItem icon={<Mail size={16} />} label="Email" href="mailto:asasikumar@berkeley.edu" external />
          </nav>
        </div>
      </div>

      {/* Scrollable content */}
      <div 
        className="flex-1 overflow-y-auto bg-sidebar [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-sidebar [&::-webkit-scrollbar-thumb]:bg-sidebar-accent [&::-webkit-scrollbar-thumb]:rounded-full [-webkit-tap-highlight-color:transparent] select-none"
        style={{
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
          outline: 'none',
          WebkitAppearance: 'none'
        }}
      >
        {/* Today's chats */}
        <div className="mt-2">
          <div className="px-3">
            <h3 className="text-xs font-medium text-sidebar-foreground/60">Today</h3>
          </div>
          <div className="mt-2 px-2 space-y-1">
            {allChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className="flex items-center gap-2 p-2 w-full text-left rounded-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-sidebar-foreground"
              >
                <span className="text-sm truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects section */}
        <div className="mt-2">
          <div className="px-3 flex items-center justify-between">
            <h3 className="text-xs font-medium text-sidebar-foreground/60">Projects</h3>
            <button className="text-sidebar-foreground/60 hover:text-sidebar-foreground rounded-full hover:bg-sidebar-accent transition-colors p-1">
              <Plus size={16} />
            </button>
          </div>
          <div className="mt-2 px-2">
            <NavItem icon={<span className="text-xs">📄</span>} label="VEX AI Robot Programming" href="#project" />
            <NavItem icon={<span className="text-xs">🤖</span>} label="Autonomous Drone Navigation" href="#project" />
            <NavItem icon={<span className="text-xs">🎮</span>} label="Game Development Projects" href="#project" />
            <NavItem icon={<span className="text-xs">🌐</span>} label="Web Development Portfolio" href="#project" />
          </div>
        </div>

        {/* Education section */}
        <div className="mt-2">
          <div className="px-3">
            <h3 className="text-xs font-medium text-sidebar-foreground/60">Education</h3>
          </div>
          <div className="mt-2 px-2 space-y-1">
            <NavItem icon={<span className="text-xs">🎓</span>} label="Undergrad: UC Berkeley M.E.T. Program" href="#education" />
          </div>
        </div>

        {/* Engineering Work Experience section */}
        <div className="mt-2">
          <div className="px-3">
            <h3 className="text-xs font-medium text-sidebar-foreground/60">Engineering Work Experience</h3>
          </div>
          <div className="mt-2 px-2 space-y-1">
            <NavItem icon={<span className="text-xs">💼</span>} label="Omron Robotics" href="#work" />
            <NavItem icon={<span className="text-xs">👁️</span>} label="AEye Technologies" href="#work" />
          </div>
        </div>

        {/* Entrepreneurial Experience section */}
        <div className="mt-2">
          <div className="px-3">
            <h3 className="text-xs font-medium text-sidebar-foreground/60">Entrepreneurial Experience</h3>
          </div>
          <div className="mt-2 px-2 space-y-1">
            <NavItem icon={<span className="text-xs">🚀</span>} label="Robolabs" href="#startup" />
            <NavItem icon={<span className="text-xs">🌟</span>} label="Robolabs Foundation" href="#foundation" />
            <NavItem icon={<span className="text-xs">🧠</span>} label="MemoryAid" href="#memoryaid" />
          </div>
        </div>

        {/* Media Features section */}
        <div className="mt-2 mb-4">
          <div className="px-3">
            <h3 className="text-xs font-medium text-sidebar-foreground/60">Media Features</h3>
          </div>
          <div className="mt-2 px-2 space-y-1">
            <NavItem icon={<span className="text-xs">📺</span>} label="ABC7 News Clips" href="#media" />
            <NavItem icon={<span className="text-xs">📰</span>} label="NBC News Clips" href="#media" />
            <NavItem icon={<span className="text-xs">🎯</span>} label="UC Berkeley Engineering News" href="#media" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  icon,
  label,
  href,
  external = false,
}: {
  icon?: React.ReactNode
  label: string
  href: string
  external?: boolean
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 rounded-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-sidebar-foreground"
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="text-sm truncate">{label}</span>
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 p-2 rounded-full hover:bg-sidebar-accent transition-colors text-sidebar-foreground hover:text-sidebar-foreground"
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-sm truncate">{label}</span>
    </Link>
  )
}

