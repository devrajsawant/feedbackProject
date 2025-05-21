"use client";
import { useState, useEffect } from "react";
import {
  Button,
  TextInput,
  Textarea,
  Select,
  Group,
  Paper,
  Table,
  Title,
  Notification,
  Divider,
  Box,
  Flex,
  Anchor,
} from "@mantine/core";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const DirectusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;

  useEffect(() => {
    const authtoken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("userId");
    setToken(authtoken);
    setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    if (token) {
      fetchFeedbacks();
    }
  }, [token, currentUserId]);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${DirectusUrl}/items/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }

      const { data } = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`${DirectusUrl}/items/feedback/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      await fetchFeedbacks();
            toast.success('Status Updated successfully')

    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${DirectusUrl}/items/feedback/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }
      await fetchFeedbacks();
            toast.success('feedback Deleted successfully')

    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${DirectusUrl}/items/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          created_by: currentUserId,
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback. Please try again.");
      }

      setFormData({ title: "", description: "", category: "" });
      await fetchFeedbacks();
            toast.success('feedback submitted successfully')

    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return <Paper p="md">Loading feedbacks...</Paper>;
  }

  return (
    <>
   

    <Paper radius="md" m={50} p={20} withBorder bg="white">
         <Flex justify={'end'} >
      <Button component={Link} href="/" color="red" variant="filled">
  Logout
</Button>
    </Flex>
      <div>
        <Title order={1} c="red">
          Submit Feedback
        </Title>

        {error && (
          <Notification color="red" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <TextInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              withAsterisk
            />
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              withAsterisk
              autosize
              minRows={3}
            />
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              withAsterisk
              data={["Bug", "Feature", "Other"]}
            />
            <Group justify="flex-end" mt={10}>
              <Button type="submit" color="blue">
                Submit
              </Button>
            </Group>
          </div>
        </form>

        <Divider color="dark.4" my="md" />

        <Title order={2} c="white">
          All Feedbacks
        </Title>

        {feedbacks.length > 0 ? (
          <Table highlightOnHover striped withTableBorder verticalSpacing="sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb.id} style={{ textAlign: "center" }}>
                  <td>{fb.title}</td>
                  <td>{fb.category}</td>
                  <td>
                    <Select
                      value={fb.status}
                      data={["Pending", "Reviewed"]}
                      onChange={(value) => handleStatusUpdate(fb.id, value)}
                      size="xs"
                      variant="filled"
                    />
                  </td>
                  <td>
                    <Button
                      c="red"
                      variant="light"
                      size="md"
                      onClick={() => handleDelete(fb.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div ta="center" c="dimmed">
            No feedbacks found.
          </div>
        )}
      </div>

    </Paper>

  
</>
  );
}