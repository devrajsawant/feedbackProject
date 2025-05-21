"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {
  Box,
  Button,
  PasswordInput,
  TextInput,
  Paper,
  Title,
  Divider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import directus from "@/libs/directus_sdk";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();
  const DirectusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
      fetchRole();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${DirectusUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setToken(data.data.access_token);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const loginResponse = await directus.auth.login({ email, password });
  //     const accessToken = directus.auth.token;
  //     setToken(accessToken);
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchRole = async (e) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${DirectusUrl}/users/me?fields=role.name,id`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      localStorage.setItem("userId", data.data.id);
      if (data.data.role.name === "feedback_admin") {
        router.push("/dashboard/admin");
      } else if (data.data.role.name === "feedback_members") {
        router.push("/dashboard/member");
      } else {
        throw new Error("Unknown role");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Paper maw={400} mt={150} p="lg" m="auto" withBorder bg="white">
          <Title order={3} ta="center" mb="md" c="Red">
            FeedBack Form
          </Title>

          <form onSubmit={handleLogin}>
            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mb="md"
            />

            <PasswordInput
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              mb="xl"
            />

            <Button type="submit" fullWidth loading={loading}>
              Login
            </Button>
          </form>
        </Paper>
      </div>
    </>
  );
}
