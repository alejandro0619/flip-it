"use client";
import { createClient } from "@/utils/supabase/client";
import Avatar from "@/components/Avatar";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuDivider,
  MenuList,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { UserProfile } from "@/components/Profile";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const {
    isOpen: isProfileEditionOpen,
    onOpen: onProfileEditionOpen,
    onClose: onProfileEditionClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.replace("/auth");
      } else {
        setUser(data.user);
      }
    };

    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.replace("/auth");
    }
  };

  const handleProfileEdition = () => {
    onProfileEditionOpen();
  };
  return (
    <div className="flex flex-col">
      <UserProfile
        isProfileOpen={isProfileEditionOpen}
        onProfileClose={onProfileEditionClose}
        userId={user?.id as string}
        isModifiable
      />
      <nav className="w-full flex justify-between items-center bg-custom-light text-custom-lighter shadow-md px-4 py-2 sm:px-6 md:px-8 lg:px-6 lg:py-2">
        <div className="bg-white px-2 py-2 rounded-lg">
          <Link href="/home">
            <span className="text-2xl font-semibold text-gradient">
              Flip it!
            </span>
          </Link>
        </div>
        <Menu>
          <MenuButton as={Button} variant="link">
            <div className=" my-2 flex items-center">
              <Avatar
                placeholder={user?.email || user?.user_metadata.name}
                size={50}
                style="character"
              />
            </div>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleProfileEdition}>Perfil</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </MenuList>
        </Menu>
      </nav>

      {children}
    </div>
  );
}
