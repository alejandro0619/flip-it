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
} from "@chakra-ui/react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();
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

  return (
    <div className="flex flex-col">
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
            <MenuItem>
              <Link href="/profile">Perfil</Link>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </MenuList>
        </Menu>
      </nav>

      {children}
    </div>
  );
}
