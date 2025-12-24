import { useState } from "react";
import { Eye, EyeSlash } from "phosphor-react";
import styles from "./index.module.css";
import { login, register } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function AuthForm(props: {setUserData: any}) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setErrors({});
    setValues({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
  };

  const handleChange = (field: string, value: string) => {
    setValues({ ...values, [field]: value });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!values.username.trim()) newErrors.username = "Tên đăng nhập không được để trống";

    if (isRegister) {
      if (!values.email.trim()) newErrors.email = "Email không được để trống";
      else if (!/^\S+@\S+\.\S+$/.test(values.email)) newErrors.email = "Email không hợp lệ";

      if (!values.confirmPassword.trim()) newErrors.confirmPassword = "Hãy nhập lại mật khẩu";
      else if (values.confirmPassword !== values.password)
        newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    if (!values.password.trim()) newErrors.password = "Mật khẩu không được để trống";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
        const data = {
        username: values.username,
        password: values.password,
        };

        const res = await login(data);
        // Lưu vào localStorage
        localStorage.setItem("userData", JSON.stringify(res));
        props.setUserData(res);
        setErrors({})
        console.log("LOGIN SUCCESS:", res.data);
        navigate("/home", { replace: true });

    } catch (e: any) {
        setError(e.response?.data?.message || "Có lỗi xảy ra");
    }
    };

    const handleRegister = async () => {
        try {
            const data = {
            username: values.username,
            password: values.password,
            email: values.email,
            };

            const res = await register(data);
            // Lưu vào localStorage
            localStorage.setItem("userData", JSON.stringify(res));
            props.setUserData(res);
            setErrors({})
            console.log("REGISTER SUCCESS:", res.data);
            // Redirect về home sau đăng ký thành công
            navigate("/home", { replace: true });

        } catch (e: any) {
            setError(e.response?.data?.message || "Có lỗi xảy ra");
        }
    };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    if (isRegister) {
      handleRegister()
    } else {
      handleLogin()
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>
        {isRegister ? "Đăng ký tài khoản" : "Đăng nhập"}
      </h2>

      {/* Hiển thị lỗi server */}
      {error && <p className={styles.serverError}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* USERNAME */}
        <div className={styles.inputGroup}>
          <input
            className={`${styles.input} ${errors?.username ? styles.errorInput : ""}`}
            type="text"
            placeholder="Tên đăng nhập"
            value={values.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
          {errors?.username && <p className={styles.errorText}>{errors.username}</p>}
        </div>

        {/* EMAIL — chỉ khi register */}
        {isRegister && (
          <div className={styles.inputGroup}>
            <input
              className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors?.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>
        )}

        {/* PASSWORD */}
        <div>
            <div className={styles.inputPassWordGroup}>
            <input
              className={`${styles.input} ${errors?.password ? styles.errorInput : ""}`}
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={values.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <EyeSlash size={20} color="#1669ef"/> : <Eye size={20} color="#1669ef"/>}
            </span>
        </div>
        {errors?.password && <p className={styles.errorText}>{errors.password}</p>}
        </div>
        

        {/* CONFIRM PASSWORD */}
        {isRegister && (
            <div>
                <div className={styles.inputPassWordGroup}>
              <input
                className={`${styles.input} ${
                  errors?.confirmPassword ? styles.errorInput : ""
                }`}
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                value={values.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {!showConfirm ? <EyeSlash size={20} color="#1669ef" /> : <Eye size={20} color="#1669ef"/>}
              </span>
            
          </div>
                {errors?.confirmPassword && (
                            <p className={styles.errorText}>{errors.confirmPassword}</p>
                            )}
            </div>
          
        )}

        {/* Remember + forgot password */}
        {!isRegister && (
          <div className={styles.options}>
            <label className={styles.remember}>
            </label>

            <button className={styles.forgotBtn} type="button">
              Quên mật khẩu?
            </button>
          </div>
        )}

        <button className={styles.submitBtn} type="submit">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </button>
      </form>

      {/* Switch */}
      <p className={styles.switchText}>
        {isRegister ? "Bạn đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
        <span className={styles.switchBtn} onClick={toggleForm}>
          {isRegister ? "Đăng nhập" : "Đăng ký"}
        </span>
      </p>
    </div>
  );
}
