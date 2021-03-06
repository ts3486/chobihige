import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";
import Home from "../views/Home.vue";
import Musicians from "../views/Musicians.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/Signup.vue";
import MyPage from "../views/MyProfile.vue";
import GraduationPage from "../views/GraduationPage.vue";
import AboutWebsiteArtist from "../views/AboutWebsiteArtist.vue";
import AboutWebsiteListener from "../views/AboutWebsiteListener.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/musicians",
    name: "Musicians",
    component: Musicians,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/myprofile",
    name: "MyProfile",
    component: MyPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/graduationpage",
    name: "GraduationPage",
    component: GraduationPage,
  },
  {
    path: "/aboutwebsiteartist",
    name: "AboutWebsiteArtist",
    component: AboutWebsiteArtist,
  },

  {
    path: "/aboutwebsitelistener",
    name: "AboutWebsiteListner",
    component: AboutWebsiteListener,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// firebaseからログイン状態を取得
firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
// ログイン認証が必要ならsinginページへ
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(recode => recode.meta.requiresAuth);
  if (requiresAuth && !(await firebase.getCurrentUser())) {
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
