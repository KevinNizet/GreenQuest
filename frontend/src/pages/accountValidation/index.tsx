import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { mutationAccountValidation } from "@/graphql/accountValidation/mutationAccountValidation";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Button, Grid, Typography } from "@mui/material";

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
  }, [token, validateAccount]);

  const handleClick = () => {
    router.replace("/signin");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Layout title="Validate Account">
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Image
            src="/images/account-validation-picture.jpg"
            alt="Image de la page de validation de compte"
            width={200}
            height={200}
          />
        </Grid>
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
            Félicitations, ton compte a été validé avec succés. Connecte toi
            pour démarrer l&apos;aventure !{" "}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleClick}
            type="submit"
            sx={{
              marginTop: "10px",
              marginBottom: "60px",
              width: { xs: "34%" },
            }}
          >
            Connecte toi
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ValidateAccount;
