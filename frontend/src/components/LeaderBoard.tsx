import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useApolloClient, useQuery } from "@apollo/client";
import { queryGetTotalPointsForQuest } from "@/graphql/queryGetTotalPointsForQuest";
import { QuestType } from "./QuestsTab";
import { queryGetQuestById } from "@/graphql/queryGetQuestById";
import { UserType } from "@/pages/userprofile";

type LeaderBoardType = {
  points: number;
  nickname: string;
  userId: number;
};

type questTest = {
  id: number;
  XPValue: number;
  users: [{ id: number; nickname: string }];
  code: number;
  createdAt: Date;
  description: string;
  difficulty: string;
  duration: number;
  missions: [{ id: number; title: string }];
  title: string;
  createdBy: UserType;
  startDate: string;
};

type LeaderBoardProps = {
  questId: number | undefined;
  userId: number | undefined;
};

const LeaderBoard = ({ questId }: LeaderBoardProps) => {
  const {
    data: questData,
    loading: questLoading,
    error: questError,
  } = useQuery<{ item: questTest }>(queryGetQuestById, {
    variables: { getQuestByIdId: questId },
    fetchPolicy: "network-only",
    skip: !questId,
  });

  const quest = questData && questData.item;

  const userIds =
    quest?.users.map((user) => {
      return user.id;
    }) || [];

  const { data, loading, error } = useQuery(queryGetTotalPointsForQuest, {
    variables: { questId: Number(questId!), userIds: userIds! },
    fetchPolicy: "network-only",
    skip: userIds?.length === 0,
    onError: (error) =>
      console.error("Error in queryGetTotalPointsForQuest:", error.message),
  });

  const usersPoints = data?.item.reduce((acc: any, userPoints: any) => {
    acc[userPoints.userId] = userPoints.points;
    return acc;
  }, {});

  if (questLoading) return <p>Loading...</p>;
  if (questError || error)
    return <p>Error: {questError?.message || error?.message}</p>;

  // Créer un tableau des utilisateurs avec leurs points
  const usersWithPoints = quest?.users.map((user) => ({
    ...user,
    points: usersPoints ? usersPoints[user.id] : 0,
  }));

  // Trier les utilisateurs par points en ordre décroissant
  const sortedUsers = usersWithPoints?.sort((a, b) => b.points - a.points);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align={"center"} style={{ minWidth: "50%" }}>
                Aventurier
              </TableCell>
              <TableCell align={"center"} style={{ minWidth: "50%" }}>
                Points
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers?.map((user) => (
              <TableRow hover role="checkbox" tabIndex={1} key={user.id}>
                <TableCell align={"center"}>{user.nickname}</TableCell>
                <TableCell align={"center"}>{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default LeaderBoard;
