import React from "react";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../firebase";

type NavbarProps = {
  sidebarOpen: boolean;

  setSidebarOpen: (
    value: boolean
  ) => void;

  userName?: string;
};

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  userName,
}: NavbarProps) {

  const handleSignOut =
    async () => {

      try {

        await signOut(
          auth
        );

      } catch (error) {

        console.error(
          "Sign out failed:",
          error
        );
      }
    };


  const displayName =
    userName?.trim() ||
    "User";


  const initial =
    displayName
      .charAt(0)
      .toUpperCase();


  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">

      {/* ================================================= */}
      {/* LEFT */}
      {/* ================================================= */}

      <div className="flex items-center gap-3">

        {/* SIDEBAR BUTTON */}

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
          title={
            sidebarOpen
              ? "Close sidebar"
              : "Open sidebar"
          }
        >

          {sidebarOpen ? (
            <span className="text-xl">
              ‹
            </span>
          ) : (
            <span className="text-xl">
              ☰
            </span>
          )}

        </button>


        {/* LOGO */}

        <div className="flex items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            ✦
          </div>

          <div>

            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Lumina AI
            </div>

            <div className="hidden text-xs text-gray-500 sm:block">
              AI Study & RAG Assistant
            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* RIGHT */}
      {/* ================================================= */}

      <div className="flex items-center gap-3">

        {/* USER */}

        <div className="flex items-center gap-2">

          {/* AVATAR */}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {initial}
          </div>


          {/* NAME */}

          <div className="hidden max-w-32 sm:block">

            <div className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
              {displayName}
            </div>

            <div className="text-xs text-gray-500">
              Signed in
            </div>

          </div>

        </div>


        {/* SIGN OUT */}

        <button
          type="button"
          onClick={
            handleSignOut
          }
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
          title="Sign out"
        >
          <span className="hidden sm:inline">
            Sign out
          </span>

          <span className="sm:hidden">
            ↪
          </span>
        </button>

      </div>

    </header>
  );
}