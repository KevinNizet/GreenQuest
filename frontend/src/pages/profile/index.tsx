import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { queryUser } from "@/graphql/queryUser";

// cette page est un test, dupliqué de "userprofile" et "index.tsx"
// pour tester sur une query avec un seul utilisateur
// et non pas tous les utilisateurs avec un .map du tableau reçu

import Layout from "@/components/Layout";

interface UserType {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
}

export default function Profile(): React.ReactNode {
  const { loading, error, data } = useQuery(queryUser, {
    variables: { userId: user.id },
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  const userData: UserType = data.user;

  return (
    <Layout title="Mon profil">
      <main className="main-content">
        <p>Page de profil</p>
        <div>
          <p>Mon adresse mail est : {userData.email}</p>
          <p>Mon prénom : {userData.firstname}</p>
          <p>Mon nom de famille : {userData.lastname}</p>
          <p>Mon pseudo : {userData.nickname}</p>
        </div>
      </main>
    </Layout>
  );
}
