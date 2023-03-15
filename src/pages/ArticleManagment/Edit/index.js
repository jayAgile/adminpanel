import React, { useEffect, useState } from "react";
import { RenderInput } from "../../../components/common/FormField";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { editArticle, getArticle } from "../../../Redux/ArticleSlice";
import { useNavigate, useParams } from "react-router-dom";
import { API_IMAGE_BASE } from "../../../constants";

export default function EditArticle() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({
    mode: "onBlur",
  });
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const article = useSelector((state) => state.article.articleDetails);
  const params = useParams();
  // const [image, setImage] = useState();
  const [state, setState] = useState({
    image: "",
    title: "",
    content: "",
    photo: "",
  });
  console.log(errors);
  useEffect(() => {
    console.log(params.id);
    let payload = {
      _id: params.id,
    };

    dispatch(getArticle(payload));
  }, []);

  useEffect(() => {
    setState({
      image: API_IMAGE_BASE + "article/" + article.image,
      photo: "",
      title: article.title,
      content: article.content,
    });
  }, [article]);

  useEffect(() => {
    reset(state);
  }, [state]);

  const onSubmit = (data) => {
    // console.log("data", data);

    if (data) {
      const { title, content, image } = data;
      const formData = new FormData();
      formData.append("_id", params.id);
      formData.append("title", title);
      formData.append("content", content);
      console.log("state.photo", state.photo);
      let img = state.photo;
      if (img != "") {
        formData.append("picture", img, img?.name);
      } else {
        formData.append("picture", img);
      }
      dispatch(editArticle(formData))
        .then((res) => {
          alert(res?.message);
          navigation("/article-management");
        })
        .catch((err) => alert(err));
    }
  };

  const onImageChange = (e) => {
    setState({
      image: window.URL.createObjectURL(e.target.files[0]),
      photo: e.target.files[0],
    });
  };

  return (
    <>
      <div>
        <h2 style={{ textAlign: "center" }}>Article Edit Management</h2>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            flexDirection: "column",
            height: "100vh",
            display: "flex",
          }}
        >
          <br />
          <div>
            <input
              type="file"
              style={{ marginBlock: 10 }}
              accept="image/*"
              // value={state?.image}
              onChange={(e) => onImageChange(e)}
            ></input>
            {!state.image && errors?.testPhotos && (
              <span style={{ color: "#e55353" }}>
                {errors?.testPhotos?.message}
              </span>
            )}
            {state.image && (
              <img
                style={{ height: 100, width: 100, marginBlock: 5 }}
                src={state.image}
              />
            )}

            <RenderInput
              // labelName={"Email"}
              outerStyle={false}
              name="title"
              type="text"
              id="addArticle"
              value={state.title}
              style={{ marginBlock: 15 }}
              register={{
                ...register("title", {
                  required: "Title required",
                  minLength: {
                    value: 2,
                    message: "Title must be at least 2 characters",
                  },
                  // validate: () => handleEmailValidation(email, errors),
                }),
              }}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  title: e.target.value,
                }))
              }
              errors={errors}
              placeholder="Title"
            />

            <textarea
              name="content"
              {...register("content", {
                required: "content Required",
                minLength: {
                  value: 2,
                  message: "Content must be at least 2 characters",
                },
              })}
              value={state.content}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  content: e.target.value,
                }))
              }
              placeholder="content"
              type="text"
            />

            {errors?.content && (
              <div>
                <span style={{ color: "#e55353" }}>
                  {errors?.content?.message}
                </span>
              </div>
            )}
          </div>
          <input type="submit" />
        </form>
      </div>
    </>
  );
}