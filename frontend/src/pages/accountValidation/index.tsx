import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { mutationAccountValidation } from "@/graphql/accountValidation/mutationAccountValidation";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Grid, Typography } from "@mui/material";

const ValidateAccount = () => {
  const router = useRouter();
  const { token } = router.query;
  const [validateAccount, { loading, error }] = useMutation(
    mutationAccountValidation
  );

  useEffect(() => {
    if (token) {
      validateAccount({ variables: { token } });
    }

    // Redirection automatique sur la page de connexion
    const redirectionTimeout = setTimeout(() => {
      router.push("/signin");
    }, 8000);

    // Nettoyage du timeout
    return () => clearTimeout(redirectionTimeout);
  }, [token, validateAccount, router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout title="Validate Account">
      <div>
        <Grid container spacing={3} padding={4}>
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="h3" paragraph>
              Compte validé !
            </Typography>
          </Grid>

          <Grid item container justifyContent="center">
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                width: "90%",
                textAlign: "center",
                marginBottom: "50px",
              }}
            >
              {" "}
              Félicitations, votre compte a été validé avec succés. Vous allez à
              présent être redirigé sur la page de connexion dans quelques
              secondes{" "}
            </Typography>
            <Image
              src="/images/account-validation-picture.jpg"
              alt="Image de la page de validation de compte"
              width={720}
              height={300}
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default ValidateAccount;
