import React from "react";
import moment from "moment";

const notificationData = [
    {
        id: 1,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 2,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 3,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 4,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 5,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 6,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 7,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 8,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 9,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 10,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 11,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 12,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 13,
        head: "Withdrawal",
        body: "You have Withdrawal",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 14,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 15,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 16,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 17,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 18,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 19,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 20,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 21,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 22,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 23,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 24,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 25,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 26,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 27,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 28,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 29,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 30,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 31,
        head: "Withdrawal",
        body: "You have Withdrawal",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 32,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 33,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },  {
        id: 34,
        head: "Withdrawal",
        body: "You have Withdrawal ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 35,
        head: "Top Up",
        body: "Your account has been top up with ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    },
    {
        id: 36,
        head: "Earn",
        body: "You have Earned ",
        icon: "fas fa-money-bill-wave",
        color: "bg-success",
        time: moment().format("h:mm A"),
        date: moment().format("DD MMM YYYY"),
        amount: 1000,
    }
];

export default notificationData;
