--
-- PostgreSQL database dump
--

\restrict KcdSvRui0kMWHIZM0QekwszN1qYuypDqAq6zOV03eolfHcci5UaR6q9PdKIBojm

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    "aggregateId" character varying(255),
    "aggregateVersion" integer,
    name character varying(255),
    body jsonb
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    name character varying(255),
    version integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, "aggregateId", "aggregateVersion", name, body) FROM stdin;
1	31431d03-27d8-47ef-aea8-14bc31974aab	1	UserCreated	{"id": "31431d03-27d8-47ef-aea8-14bc31974aab", "name": "Dima"}
2	5881f52b-ea10-4d7e-8e8c-1c2af1a58788	1	UserCreated	{"id": "5881f52b-ea10-4d7e-8e8c-1c2af1a58788", "name": "Dima"}
3	5881f52b-ea10-4d7e-8e8c-1c2af1a58788	2	UserNameUpdated	{"name": "Dmytro", "previousName": "Dima"}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, version) FROM stdin;
31431d03-27d8-47ef-aea8-14bc31974aab	Dima	1
5881f52b-ea10-4d7e-8e8c-1c2af1a58788	Dmytro	2
\.


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 3, true);


--
-- Name: events events_aggregateid_aggregateversion_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_aggregateid_aggregateversion_unique UNIQUE ("aggregateId", "aggregateVersion");


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict KcdSvRui0kMWHIZM0QekwszN1qYuypDqAq6zOV03eolfHcci5UaR6q9PdKIBojm

