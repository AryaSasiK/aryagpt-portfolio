"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle } from "lucide-react"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  onNewChat?: () => void
}

export function Header({ sidebarOpen, setSidebarOpen, onNewChat = () => {} }: HeaderProps) {
  return (
    <motion.div 
      className="sticky top-0 z-50 flex items-center justify-between p-2 bg-[#171717]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-full hover:bg-[#2a2b32] transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* New Chat button - only shown when sidebar is hidden */}
        {!sidebarOpen && (
          <motion.button
            onClick={onNewChat}
            className="flex items-center gap-1 p-1 rounded-full hover:bg-[#2a2b32] transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400"
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
          </motion.button>
        )}

        <span className="font-medium pl-2">AryaGPT</span>
      </div>

      <div className="flex items-center gap-2">
        <motion.a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSe2RfM2L2pd7-nPrGb-MdQryRMFZdbZzd2pkJIOPOZid-Spxw/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-[#1e1f25] hover:bg-[#2a2b32] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 3"
            />
          </svg>
          Want Your Own GPT Personal Portfolio?
        </motion.a>
        
        {/* Mobile version with just the icon */}
        <motion.a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSe2RfM2L2pd7-nPrGb-MdQryRMFZdbZzd2pkJIOPOZid-Spxw/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[#1e1f25] hover:bg-[#2a2b32] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Want Your Own GPT Personal Portfolio?"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 3"
            />
          </svg>
        </motion.a>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src="/images/profile.png" alt="Arya Sasikumar" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
      </div>
    </motion.div>
  )
} 