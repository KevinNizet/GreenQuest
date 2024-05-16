import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import React from "react";
import { userType } from "./Header";
import { queryMySelf } from "@/graphql/queryMySelf";
import { queryGetQuestByUser } from "@/graphql/queryGetQuestByUser";

export type QuestType = {
  id: number;
  XPValue: number;
  users: { id: number };
  code: number;
  createdAt: Date;
  description: string;
  difficulty: string;
  duration: number;
  missions: [];
};

const QuestsTab = () => {
  const {
    loading: meLoading,
    data: medata,
    error: meErrors,
  } = useQuery<{ item: userType }>(queryMySelf);

  const me = medata && medata.item;

  const { data, loading, error } = useQuery<{ item: QuestType[] }>(
    queryGetQuestByUser,
    {
      variables: {
        userId: me?.id,
      },
    }
  );
  console.log(error);

  const quest = data && data.item;

  console.log(quest, "je suis ici");

  return (
    <Box
      sx={{
        width: "90%",
        height: "75%",
        backgroundColor: "#f1d6b8",
        borderRadius: "30px",
        boxShadow: 2,
        marginTop: 0,
      }}
    ></Box>
  );
};

export default QuestsTab;
