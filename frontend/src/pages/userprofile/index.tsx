import React from "react";
import { useQuery } from "@apollo/client";
import { queryGetUsers } from "@/graphql/queryGetUser";

import Layout from "@/components/Layout";
import { queryUser } from "@/graphql/queryUser";
import { queryMySelf } from "@/graphql/queryMySelf";

interface UserType {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
}

export default function Profile(): React.ReactNode {
  /*  const { loading, error, data } = useQuery(queryGetUsers); */
  const { loading, error, data } = useQuery(queryMySelf);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  const me = data?.item;

  /* const users = data?.getUsers; */

  console.log(me);

  // la const users (récupérée depuis la query getUsers) retourne un tableau d'utilisateur
  // il faut donc faire un .map

  //TODO recréer un utilisateur via mutation signup sur Apollo Studio

  return (
    <Layout title="Mon profil">
      <main className="main-content">
        <p>Page de profil</p>
        {me?.email}
        {me?.id}
        {/* {users.map((user: UserType) => (
          <div key={user.id}>
            <p>Mon adresse mail est : {user.email}</p>
            <p>Mon prénom : {user.firstname}</p>
            <p>Mon nom de famille : {user.lastname}</p>
            <p>Mon pseudo : {user.nickname}</p>
            <p>Mon id : {user.id}</p>
          </div>
        ))} */}
      </main>
    </Layout>
  );
}
