"use client";

import { useEffect, useState } from "react";

const useUsername = () => {
  const [username, setUsername] = useState("loading...");

  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setUsername(stored);
        return;
      }

      const generated = generateUsername();
      localStorage.setItem(STORAGE_KEY, generated);
      setUsername(generated);
    };

    main();
  }, []);

  return { username };
};

const ANIMALS = [
  "lion",
  "tiger",
  "elephant",
  "giraffe",
  "zebra",
  "monkey",
  "panda",
  "kangaroo",
  "penguin",
  "bear",
  "wolf",
  "fox",
  "rabbit",
  "deer",
  "otter",
  "leopard",
  "cheetah",
  "koala",
  "hippo",
  "rhino",
];

const STORAGE_KEY = "chat_username";

const generateUsername = () => {
  const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const id = Math.random().toString(36).substring(2, 7); // 5 digit id

  return `anonymous-${word}-${id}`;
};

export { useUsername };
