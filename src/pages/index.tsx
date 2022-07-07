import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Stack,
  Tag,
  Button,
  Flex,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { trpc } from "../utils/trpc";
import React from "react";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    "todo.get",
  ]);
  const utils = trpc.useContext();
  const deleteTodo = trpc.useMutation(["todo.delete"], {
    onSuccess: () => {
      utils.invalidateQuery(["todo.get"]);
    },
  });
  const createTodo = trpc.useMutation(["todo.add"], {
    onMutate: (res) => {
      // const prevTodo = utils.getQueryData(["todo.get"])
      utils.setQueryData(["todo.get"], (old) => {
        return {
          todos: [...(old?.todos ?? []), { ...res, id: Date.now() }],
        };
      });
    },
    onSuccess: (res) => {
      utils.invalidateQueries(["todo.get"]);
    },
  });
  const [text, setText] = React.useState("");

  const handleDelete = (id: number) => {
    deleteTodo.mutate({ id });
  }

  const handleSubmit = async () => {
    setText("");
    createTodo.mutate({ message: text, completed: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
        <Flex justify="center" pt={6}>
      <Box>
        <Stack spacing={4} mb={6}>
          {data?.todos.map((todo) => (
            <Stack key={todo.id} direction="row" spacing={4}>
              <IconButton
                onClick={() => handleDelete(todo.id)}
                aria-label="Search database"
                bg="red.400"
                size="sm"
                icon={<DeleteIcon color="white" />}
              />
              <Stack>
                <Box>{todo.message}</Box>
                <Tag>{todo.completed ? "completed" : "not completed"}</Tag>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Stack direction="row" spacing={4}>
          <Input
            onChange={handleChange}
            variant="outline"
            value={text}
            placeholder="Outline"
          />
          <Button
            onClick={handleSubmit}
            colorScheme="teal"
            flexShrink={0}
            variant="solid"
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Flex>

  );
};

export default Home;
