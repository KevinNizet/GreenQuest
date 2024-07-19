import React, { useState, useRef, ChangeEvent } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Layout from "@/components/Layout";
import { queryMySelf } from "@/graphql/queryMySelf";
import { mutationUpdateUser } from "@/graphql/userProfileUpdate/mutationUpdateUser";
import { Button, Grid, Typography, TextField, Avatar } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import { mutationUpdateUserImage } from "@/graphql/userProfileUpdate/mutationUpdateUserImage";

export interface UserType {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
  id: number;
  image?: {
    uri: string;
  };
}

export default function Profile(): React.ReactNode {
  const { loading, error, data } = useQuery(queryMySelf);
  const [updateUser] = useMutation(mutationUpdateUser);
  const [updateUserImage] = useMutation(mutationUpdateUserImage);
  const [editable, setEditable] = useState(false);
  const [editableFields, setEditableFields] = useState<UserType | null>(null);
  const [firstnameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [toastOpen, setToastOpen] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = toastOpen;
  const [toastMessage, setToastMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error.message}</p>;

  const me = data?.item;

  console.log(me);

  const handleFieldChange = (field: keyof UserType, value: string) => {
    if (editableFields) {
      setEditableFields({
        ...editableFields,
        [field]: value,
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const backUrl = process.env.NEXT_PUBLIC_BACK_URL;

  const handleUpdateProfile = async () => {
    if (editableFields) {
      const { firstname, lastname, nickname } = editableFields;
      const isFirstNameValid = validateFirstName(firstname);
      const isLastNameValid = validateLastName(lastname);
      const isNicknameValid = validNickName(nickname);

      if (!isFirstNameValid || !isLastNameValid || !isNicknameValid) {
        return;
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await fetch(`${backUrl}/api/users/${me.id}/image`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const result = await response.json();
        if (result.success) {
          const imageId = result.image.id;
          await updateUserImage({
            variables: {
              image: { id: imageId },
            },
            refetchQueries: [{ query: queryMySelf }],
          });
        } else {
          setToastMessage(
            "Une erreur est survenue lors de l'upload de l'image."
          );
          setToastOpen({ ...toastOpen, open: true });
          return;
        }
      }

      updateUser({
        variables: {
          firstname,
          lastname,
          nickname,
        },
        refetchQueries: [{ query: queryMySelf }],
      })
        .then(() => {
          setToastMessage("Ton profil a été mis à jour avec succès 👍🏻 !");
          setToastOpen({ ...toastOpen, open: true });
        })
        .catch((error) => {
          setToastMessage("Une erreur est survenue 😔 ");
          setToastOpen({ ...toastOpen, open: true });
        });
      setEditable(false);
    }
  };

  const validateFirstName = (value: string) => {
    const isValid = value.trim() !== "";
    setFirstNameError(!isValid);
    return isValid;
  };

  const validateLastName = (value: string) => {
    const isValid = value.trim() !== "";
    setLastNameError(!isValid);
    return isValid;
  };

  const validNickName = (value: string) => {
    const isValid = value.trim() !== "";
    setNicknameError(!isValid);
    return isValid;
  };

  return (
    <Layout title="Mon profil">
      <div>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="h3" paragraph style={{ marginTop: "50px" }}>
              Page de profil
            </Typography>
          </Grid>
          <Grid item container justifyContent="center">
            <Typography
              variant="body1"
              gutterBottom
              sx={{ width: "90%", textAlign: "center", marginBottom: "50px" }}
            >
              L&apos;adresse email liée à ton compte est : {me?.email} <br />
              Si tu souhaites la modifier, contacte un administrateur.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <div
              style={{
                backgroundColor: "#ECEBF5",
                padding: "20px",
                borderRadius: "5px",
                margin: "0 auto",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" paragraph>
                    Pseudo
                  </Typography>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{ width: "100%" }}
                    value={
                      editable
                        ? (editableFields && editableFields.nickname) || ""
                        : (me && me.nickname) || ""
                    }
                    onChange={(e) =>
                      handleFieldChange("nickname", e.target.value)
                    }
                    disabled={!editable}
                    error={nicknameError}
                    helperText={
                      nicknameError ? "Renseigner un pseudo valide" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" paragraph>
                    Prénom
                  </Typography>
                  <TextField
                    variant="outlined"
                    sx={{ width: "100%" }}
                    autoComplete="off"
                    value={
                      editable
                        ? (editableFields && editableFields.firstname) || ""
                        : (me && me.firstname) || ""
                    }
                    onChange={(e) =>
                      handleFieldChange("firstname", e.target.value)
                    }
                    disabled={!editable}
                    error={firstnameError}
                    helperText={
                      firstnameError ? "Renseigner un prénom valide" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" paragraph>
                    Nom
                  </Typography>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    sx={{ width: "100%" }}
                    value={
                      editable
                        ? (editableFields && editableFields.lastname) || ""
                        : (me && me.lastname) || ""
                    }
                    onChange={(e) =>
                      handleFieldChange("lastname", e.target.value)
                    }
                    disabled={!editable}
                    error={lastNameError}
                    helperText={lastNameError ? "Renseigner un nom valide" : ""}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  justifyContent="flex-end"
                  marginTop={5}
                >
                  {editable ? (
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={handleUpdateProfile}
                    >
                      Enregistrer
                    </Button>
                  ) : (
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => {
                        setEditable(true);
                        setEditableFields({ ...me });
                      }}
                    >
                      Modifier
                    </Button>
                  )}
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={() => setToastOpen({ ...toastOpen, open: false })}
          message={toastMessage}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          key={vertical + horizontal}
        />
      </div>
    </Layout>
  );
}
