import Vue from "vue";
import Vuex from "vuex";
import app from './modules/app';
import tag from './modules/tag';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        app,
        tag
    }
});

export default store;
