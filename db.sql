-- Active: 1740465604937@@127.0.0.1@5432@bot

CREATE DATABASE nt_oshxona

DROP DATABASE nt_oshxona;


SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = 'nt_oshxona' AND pid <> pg_backend_pid();
