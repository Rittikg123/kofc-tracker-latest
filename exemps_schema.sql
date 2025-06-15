--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
-- Name: exemps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exemps (
    council character varying(10) NOT NULL,
    event_date date NOT NULL,
    event_time time without time zone,
    location_name character varying(100),
    location_city character varying(100),
    note text,
    contact_name character varying(100),
    contact_phone character varying(20),
    contact_email character varying(100),
    status character varying(20),
    new_members integer,
    e_members integer,
    total_attendees integer,
    reporting_user character varying(100),
    reporting_date date,
    creation_user character varying(100),
    creation_date date,
    updating_user character varying(100),
    updating_date date,
    location_zipcode character varying(15),
    location_address character varying(200)
);


ALTER TABLE public.exemps OWNER TO postgres;

--
-- Name: exemps exemps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exemps
    ADD CONSTRAINT exemps_pkey PRIMARY KEY (council, event_date);


--
-- PostgreSQL database dump complete
--

