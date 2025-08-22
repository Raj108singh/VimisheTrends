--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.analytics_events (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    event_type character varying NOT NULL,
    user_id character varying,
    session_id character varying,
    product_id character varying,
    category_id character varying,
    order_id character varying,
    value numeric(10,2),
    metadata jsonb,
    user_agent text,
    ip_address character varying,
    referrer text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.analytics_events OWNER TO neondb_owner;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cart_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    product_id character varying NOT NULL,
    quantity integer NOT NULL,
    size character varying,
    color character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart_items OWNER TO neondb_owner;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.categories (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description text,
    image_url character varying,
    parent_id character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO neondb_owner;

--
-- Name: coupon_usage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.coupon_usage (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    coupon_id character varying NOT NULL,
    user_id character varying,
    order_id character varying,
    discount_amount numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.coupon_usage OWNER TO neondb_owner;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.coupons (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    code character varying NOT NULL,
    title character varying NOT NULL,
    description text,
    type character varying NOT NULL,
    value numeric(10,2) NOT NULL,
    minimum_amount numeric(10,2),
    maximum_discount numeric(10,2),
    usage_limit integer,
    usage_count integer DEFAULT 0,
    user_limit integer DEFAULT 1,
    applicable_categories text[],
    applicable_products text[],
    is_active boolean DEFAULT true,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.coupons OWNER TO neondb_owner;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.order_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    order_id character varying NOT NULL,
    product_id character varying NOT NULL,
    quantity integer NOT NULL,
    size character varying,
    color character varying,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.order_items OWNER TO neondb_owner;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.orders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    shipping_address jsonb NOT NULL,
    billing_address jsonb,
    payment_method character varying,
    payment_status character varying DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.orders OWNER TO neondb_owner;

--
-- Name: payment_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payment_settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    provider character varying NOT NULL,
    display_name character varying NOT NULL,
    api_key character varying,
    secret_key character varying,
    webhook_secret character varying,
    is_active boolean DEFAULT false,
    is_test_mode boolean DEFAULT true,
    configuration jsonb,
    supported_currencies text[],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.payment_settings OWNER TO neondb_owner;

--
-- Name: products; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.products (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description text,
    short_description text,
    price numeric(10,2) NOT NULL,
    sale_price numeric(10,2),
    sku character varying,
    stock integer DEFAULT 0,
    image_url character varying,
    images text[],
    category_id character varying NOT NULL,
    sizes text[],
    colors text[],
    tags text[],
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_on_sale boolean DEFAULT false,
    rating numeric(3,2) DEFAULT '0'::numeric,
    review_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO neondb_owner;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reviews (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    product_id character varying NOT NULL,
    rating integer NOT NULL,
    title character varying,
    comment text,
    is_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.reviews OWNER TO neondb_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.site_settings (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    key character varying NOT NULL,
    value text,
    category character varying NOT NULL,
    type character varying DEFAULT 'text'::character varying NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    updated_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.site_settings OWNER TO neondb_owner;

--
-- Name: sliders; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sliders (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    title character varying NOT NULL,
    description text,
    image_url character varying NOT NULL,
    link_url character varying,
    button_text character varying,
    "position" integer DEFAULT 0,
    type character varying DEFAULT 'slider'::character varying NOT NULL,
    placement character varying DEFAULT 'home'::character varying,
    is_active boolean DEFAULT true,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sliders OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    password character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    is_admin boolean DEFAULT false,
    auth_provider character varying DEFAULT 'email'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.wishlist_items (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    product_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.wishlist_items OWNER TO neondb_owner;

--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.analytics_events (id, event_type, user_id, session_id, product_id, category_id, order_id, value, metadata, user_agent, ip_address, referrer, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cart_items (id, user_id, product_id, quantity, size, color, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.categories (id, name, slug, description, image_url, parent_id, is_active, created_at) FROM stdin;
146d50bc-c7ac-4542-a796-c591532750f0	Boys Clothing	boys-clothing	Stylish and comfortable clothing for boys	/images/boys-category.jpg	\N	t	2025-08-22 19:33:53.93754
69e898d9-9e46-45e9-9cc6-f37c6ee3f33b	Girls Clothing	girls-clothing	Trendy and fashionable clothing for girls	/images/girls-category.jpg	\N	t	2025-08-22 19:33:53.93754
8bed28ff-2d60-40ac-83cc-8cd11c5825f2	Babies & Toddlers	babies-toddlers	Soft and safe clothing for babies and toddlers	/images/babies-category.jpg	\N	t	2025-08-22 19:33:53.93754
bca985e0-138a-4c7e-8b39-50ad4590971c	Shoes	shoes	Comfortable and stylish footwear for children	/images/shoes-category.jpg	\N	t	2025-08-22 19:33:53.93754
bb1731c5-19e6-46d2-aef1-ba53babe38f3	Accessories	accessories	Fun and functional accessories for kids	/images/accessories-category.jpg	\N	t	2025-08-22 19:33:53.93754
333d9964-5102-490d-9f0e-fad0aff93a95	School Uniforms	school-uniforms	Quality school uniforms for all ages	/images/uniforms-category.jpg	\N	t	2025-08-22 19:33:53.93754
985c516b-26fc-4ca9-a2a1-2cc0ec36ea42	Party Wear	party-wear	Special occasion and party outfits	/images/party-category.jpg	\N	t	2025-08-22 19:33:53.93754
7879acc1-fd03-4a87-a699-3e014d7a0fdd	Sportswear	sportswear	Active wear for sports and outdoor activities	/images/sports-category.jpg	\N	t	2025-08-22 19:33:53.93754
\.


--
-- Data for Name: coupon_usage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.coupon_usage (id, coupon_id, user_id, order_id, discount_amount, created_at) FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.coupons (id, code, title, description, type, value, minimum_amount, maximum_discount, usage_limit, usage_count, user_limit, applicable_categories, applicable_products, is_active, start_date, end_date, created_at, updated_at) FROM stdin;
a64fcc74-782e-4492-af0f-9ee2d644725a	WELCOME10	Welcome Discount	Get 10% off on your first order!	percentage	10.00	25.00	50.00	100	0	1	\N	\N	t	2025-08-22 19:35:14.367134	2025-11-20 19:35:14.367134	2025-08-22 19:35:14.367134	2025-08-22 19:35:14.367134
d0295537-da85-4151-be93-8b86ecbf0b09	SUMMER50	Summer Sale	Huge summer sale - 50% off on selected items!	percentage	50.00	50.00	100.00	50	15	2	{boys-clothing,girls-clothing}	\N	t	2025-08-22 19:35:14.367134	2025-09-21 19:35:14.367134	2025-08-22 19:35:14.367134	2025-08-22 19:35:14.367134
b07e9b58-9ebe-4735-bcf6-a7b764270509	FREESHIP	Free Shipping	Free shipping on any order!	free_shipping	0.00	30.00	\N	200	25	1	\N	\N	t	2025-08-22 19:35:14.367134	2025-10-21 19:35:14.367134	2025-08-22 19:35:14.367134	2025-08-22 19:35:14.367134
fe5c2731-0625-4a84-808d-0f774de197ff	SAVE20	Save $20	Get $20 off on orders over $100	fixed	20.00	100.00	\N	75	8	1	\N	\N	t	2025-08-22 19:35:14.367134	2025-10-06 19:35:14.367134	2025-08-22 19:35:14.367134	2025-08-22 19:35:14.367134
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.order_items (id, order_id, product_id, quantity, size, color, price, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.orders (id, user_id, status, total_amount, shipping_address, billing_address, payment_method, payment_status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payment_settings (id, provider, display_name, api_key, secret_key, webhook_secret, is_active, is_test_mode, configuration, supported_currencies, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.products (id, name, slug, description, short_description, price, sale_price, sku, stock, image_url, images, category_id, sizes, colors, tags, is_active, is_featured, is_on_sale, rating, review_count, created_at, updated_at) FROM stdin;
5e0643aa-e079-4993-95aa-4026f54fcf18	Princess Dress Collection	princess-dress-collection	Beautiful princess-style dress with sparkly details and flowing skirt. Perfect for special occasions and dress-up play.	Sparkly princess dress with flowing skirt	49.99	39.99	GIRL-DRESS-001	20	/images/princess-dress.jpg	{/images/princess-dress-1.jpg,/images/princess-dress-2.jpg,/images/princess-dress-3.jpg}	69e898d9-9e46-45e9-9cc6-f37c6ee3f33b	{2T,3T,4T,5T,6,7,8}	{Pink,Purple,Blue}	{princess,dress,sparkly,special}	t	t	t	4.70	31	2025-08-22 19:34:16.517756	2025-08-22 19:34:16.517756
e68daa1b-bd9c-4d6a-9b91-a86f3d053481	Floral Leggings Set	girls-floral-leggings-set	Matching top and leggings set with beautiful floral patterns. Soft cotton blend for all-day comfort.	Floral top and leggings matching set	27.99	\N	GIRL-LEGG-001	40	/images/floral-leggings.jpg	{/images/floral-leggings-1.jpg,/images/floral-leggings-2.jpg}	69e898d9-9e46-45e9-9cc6-f37c6ee3f33b	{2T,3T,4T,5T,6,8}	{Pink,Lavender,Mint}	{floral,leggings,set,comfortable}	t	f	f	4.40	12	2025-08-22 19:34:16.517756	2025-08-22 19:34:16.517756
81cba9f7-af7f-4d18-96f5-ce4e768779e0	Rainbow Tutu Skirt	rainbow-tutu-skirt	Colorful rainbow tutu skirt perfect for dance, play, and parties. Elastic waistband for comfortable fit.	Colorful rainbow tutu with elastic waist	22.99	18.99	GIRL-TUTU-001	35	/images/rainbow-tutu.jpg	{/images/rainbow-tutu-1.jpg,/images/rainbow-tutu-2.jpg}	69e898d9-9e46-45e9-9cc6-f37c6ee3f33b	{2T,3T,4T,5T,6}	{Rainbow,"Pink Rainbow","Purple Rainbow"}	{tutu,rainbow,dance,party}	t	t	t	4.60	28	2025-08-22 19:34:16.517756	2025-08-22 19:34:16.517756
2bff5f61-6d2e-4d6a-8cbf-28cf371da68c	Organic Cotton Onesie Set	organic-cotton-onesie-set	Pack of 5 organic cotton onesies with snap closures. Hypoallergenic and perfect for sensitive baby skin.	Pack of 5 organic cotton onesies	35.99	29.99	BABY-ONE-001	60	/images/baby-onesies.jpg	{/images/baby-onesies-1.jpg,/images/baby-onesies-2.jpg}	8bed28ff-2d60-40ac-83cc-8cd11c5825f2	{0-3M,3-6M,6-9M,9-12M,12-18M}	{White,Pink,Blue,Yellow}	{organic,cotton,onesie,baby}	t	t	t	4.80	45	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
0a3991f2-fce8-474c-8420-911d6c044b31	Sleepy Bear Pajama Set	sleepy-bear-pajama-set	Adorable bear-themed pajama set with soft fleece material. Perfect for cozy nights and sweet dreams.	Bear-themed fleece pajama set	28.99	\N	BABY-PJ-001	40	/images/bear-pajamas.jpg	{/images/bear-pajamas-1.jpg,/images/bear-pajamas-2.jpg}	8bed28ff-2d60-40ac-83cc-8cd11c5825f2	{12M,18M,2T,3T,4T}	{Brown,Cream,Gray}	{pajamas,bear,fleece,sleep}	t	f	f	4.50	20	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
6a3b41bd-21ef-4e55-ab8a-7fd244a26f69	Light-Up Sneakers	light-up-sneakers	Fun LED light-up sneakers that flash with every step. Velcro straps for easy on/off.	LED light-up sneakers with velcro straps	45.99	39.99	SHOE-LED-001	25	/images/light-up-shoes.jpg	{/images/light-up-shoes-1.jpg,/images/light-up-shoes-2.jpg}	bca985e0-138a-4c7e-8b39-50ad4590971c	{5,6,7,8,9,10,11,12,13}	{Black/Blue,Pink/Purple,Red/White}	{LED,sneakers,lights,velcro}	t	t	t	4.40	33	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
c1b48f6e-546a-4cd6-861a-fbf0c141269b	Canvas High-Tops	canvas-high-tops	Classic canvas high-top sneakers available in multiple colors. Durable rubber sole and comfortable fit.	Classic canvas high-top sneakers	32.99	\N	SHOE-CANVAS-001	30	/images/canvas-hightops.jpg	{/images/canvas-hightops-1.jpg,/images/canvas-hightops-2.jpg}	bca985e0-138a-4c7e-8b39-50ad4590971c	{6,7,8,9,10,11,12,13}	{Red,Blue,Black,White}	{canvas,high-top,classic,rubber}	t	f	f	4.10	16	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
bdb716fc-c75a-45e5-a356-c28a879bc710	Unicorn Backpack	unicorn-backpack	Magical unicorn-themed backpack with multiple compartments. Perfect for school or day trips.	Magical unicorn backpack with compartments	42.99	35.99	ACC-BAG-001	20	/images/unicorn-backpack.jpg	{/images/unicorn-backpack-1.jpg,/images/unicorn-backpack-2.jpg}	bb1731c5-19e6-46d2-aef1-ba53babe38f3	{Small,Medium,Large}	{Pink,Purple,White}	{unicorn,backpack,school,magic}	t	t	t	4.70	29	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
27dd3277-5a92-4b70-a49d-4abe535e44e8	Superhero Cape Set	superhero-cape-set	Set of 3 superhero capes with matching masks. Perfect for imaginative play and costume parties.	Set of 3 superhero capes with masks	25.99	19.99	ACC-CAPE-001	35	/images/superhero-capes.jpg	{/images/superhero-capes-1.jpg,/images/superhero-capes-2.jpg}	bb1731c5-19e6-46d2-aef1-ba53babe38f3	{"One Size"}	{Red/Blue,Green/Yellow,Pink/Purple}	{superhero,cape,mask,costume}	t	t	t	4.60	22	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
aa9a393c-5db5-4013-acb4-9ece61e821e6	Denim Jeans - Blue	boys-denim-jeans-blue	Classic blue denim jeans with adjustable waist and reinforced knees. Durable construction for active boys.	Classic blue denim jeans with adjustable waist	39.99	\N	BOY-JEANS-001	30	https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400	{https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400,https://images.unsplash.com/photo-1556821840-3a9fbc2abd3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400}	146d50bc-c7ac-4542-a796-c591532750f0	{2T,3T,4T,5T,6,7,8,10}	{Blue,"Dark Blue"}	{denim,jeans,boys,adjustable}	t	f	f	4.20	15	2025-08-22 19:34:16.517756	2025-08-22 19:34:16.517756
1bf6365d-8b27-4b53-b227-999e2e6f782e	Navy Blue Polo Uniform	navy-blue-polo-uniform	Official school uniform polo shirt in navy blue. Comfortable cotton blend with school-approved design.	Navy blue school uniform polo shirt	18.99	\N	UNI-POLO-001	50	/images/uniform-polo.jpg	{/images/uniform-polo-1.jpg,/images/uniform-polo-2.jpg}	333d9964-5102-490d-9f0e-fad0aff93a95	{4,5,6,7,8,10,12,14}	{"Navy Blue",White}	{uniform,polo,school,navy}	t	f	f	4.30	14	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
09483cad-ee67-489b-8d82-01ccbbc374ba	Plaid Skirt Uniform	plaid-skirt-uniform	Classic plaid school uniform skirt with pleats. Comfortable waistband and knee-length design.	Classic plaid school uniform skirt	24.99	\N	UNI-SKIRT-001	40	/images/uniform-skirt.jpg	{/images/uniform-skirt-1.jpg,/images/uniform-skirt-2.jpg}	333d9964-5102-490d-9f0e-fad0aff93a95	{4,5,6,7,8,10,12}	{Navy/White,Green/Blue}	{uniform,plaid,skirt,school}	t	f	f	4.20	11	2025-08-22 19:34:42.720335	2025-08-22 19:34:42.720335
c1b00fdc-ba1c-4a4b-b810-54b6382399c3	Superhero T-Shirt Pack	superhero-tshirt-pack	Pack of 3 comfortable cotton t-shirts featuring popular superhero designs. Perfect for everyday wear with soft breathable fabric.	Pack of 3 superhero themed cotton t-shirts	29.99	24.99	BOY-TSHIRT-001	50	https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400	{https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400,https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400,https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400}	146d50bc-c7ac-4542-a796-c591532750f0	{2T,3T,4T,5T,6,7,8}	{Red,Blue,Green}	{superhero,cotton,pack,boys}	t	t	t	4.50	23	2025-08-22 19:34:16.517756	2025-08-22 19:34:16.517756
232a67be-e391-4e76-8935-6d659f43f5eb	Polo Shirt Set	boys-polo-shirt-set	Set of 2 classic polo shirts in different colors. Perfect for school or casual outings.	Set of 2 classic polo shirts	34.99	29.99	BOY-POLO-001	25	https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400	{https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400,https://images.unsplash.com/photo-1556821840-3a9fbc2abd3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400}	146d50bc-c7ac-4542-a796-c591532750f0	{4,5,6,7,8,10,12}	{Navy,White,Red}	{polo,school,casual,set}	t	t	t	4.30	18	2025-08-22 19:34:16.517756	2025-08-22 19:34:16.517756
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reviews (id, user_id, product_id, rating, title, comment, is_verified, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
5-Klxe0d_yGz-E3MURVtEJlSdi4g92ao	{"cookie": {"path": "/", "secure": false, "expires": "2025-08-29T19:42:17.220Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"id": "b31f27b5-2619-4474-bc05-5896bdaaf91b", "email": "admin@example.com", "isAdmin": true}}}	2025-08-29 19:48:27
7U0MQm9xsXWyvKjfKMSzpaOBNhLPuPRh	{"cookie": {"path": "/", "secure": false, "expires": "2025-08-29T19:27:17.313Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"id": "b31f27b5-2619-4474-bc05-5896bdaaf91b", "email": "admin@example.com", "isAdmin": true}}}	2025-08-29 19:29:33
fVMim_R2ZPa_p9sU-TQXinEhjr5U5Zs-	{"cookie": {"path": "/", "secure": false, "expires": "2025-08-29T19:37:31.421Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"id": "b31f27b5-2619-4474-bc05-5896bdaaf91b", "email": "admin@example.com", "isAdmin": true}}}	2025-08-29 19:37:42
ZkQHD1paHOkG8X4USy4P_gfRhkTEnrti	{"cookie": {"path": "/", "secure": false, "expires": "2025-08-29T19:51:20.667Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"id": "b31f27b5-2619-4474-bc05-5896bdaaf91b", "email": "admin@example.com", "isAdmin": true}}}	2025-08-29 19:51:32
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.site_settings (id, key, value, category, type, description, is_active, updated_at, created_at) FROM stdin;
825bc91f-40f1-40ff-ada1-566f2c7a72ce	site_name	Vimishe Fashion Trends	general	text	Website name	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
c2b555a6-bb5a-4fe7-964d-0a5f21e23927	site_description	Premium Children's Fashion - Stylish, Comfortable, and Affordable	general	text	Website description	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
ea880db5-eb37-42b7-8bbf-9408bdcc7fb6	contact_email	info@vimishefashion.com	contact	text	Contact email address	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
938fabfe-be29-4ab6-a0af-43aafba21339	contact_phone	+1 (555) 123-4567	contact	text	Contact phone number	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
642c1d23-0b66-4c7b-a772-129e91260c2a	whatsapp_number	+1555123456789	contact	text	WhatsApp Business number	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
16f9730c-6afc-42ce-8d3d-6244ef65b85d	address	123 Fashion Avenue, Style City, SC 12345	contact	text	Business address	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
64a45656-32a4-47d8-a3ab-1903efdc5470	currency	USD	general	text	Store currency	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
c385230e-ccc8-46e1-a9f0-849782f89a2a	tax_rate	0.08	general	text	Tax rate percentage	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
7666991c-d6c4-4584-b5a8-f095e74e9673	shipping_cost	5.99	shipping	text	Standard shipping cost	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
bb56e649-5d57-4b08-a856-97dc020d8b5d	free_shipping_threshold	75.00	shipping	text	Free shipping minimum order	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
ad23bc1a-a816-42ae-bf12-fa54cc3b3316	facebook_url	https://facebook.com/vimishefashion	social	text	Facebook page URL	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
7b091546-451d-4fb7-8cba-9bed68175fc1	instagram_url	https://instagram.com/vimishefashion	social	text	Instagram page URL	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
93e5c8d4-7bcd-4d4d-b546-ba7a377a3655	twitter_url	https://twitter.com/vimishefashion	social	text	Twitter page URL	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
75135939-ff25-4f4f-ac2f-73eb5100b8d6	store_hours	Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed	general	text	Store operating hours	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
1f0bcd47-5044-4ec6-9181-88678ff6f03a	header_logo	/images/logo.png	header	image	Website header logo	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
a7c3b93f-32f9-4ef7-bc62-362e13a5c309	header_announcement	Free shipping on orders over $75! 🚚	header	text	Header announcement bar	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
786a61a7-044b-497a-8b33-9b797d02327e	footer_copyright	© 2024 Vimishe Fashion Trends. All rights reserved.	footer	text	Footer copyright text	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
15a7bde4-deec-4631-b73c-3fd42a36322d	seo_keywords	children clothing, kids fashion, boys clothes, girls clothes, baby wear	seo	text	SEO meta keywords	t	2025-08-22 19:35:04.588365	2025-08-22 19:35:04.588365
\.


--
-- Data for Name: sliders; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sliders (id, title, description, image_url, link_url, button_text, "position", type, placement, is_active, start_date, end_date, created_at, updated_at) FROM stdin;
56e276be-24a7-4091-8f37-3400a485a744	Summer Sale 2024	Up to 50% off on all summer collection! Shop the latest trends for your little ones.	https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600	/products?category=summer	Shop Now	1	slider	home	t	2025-08-22 19:35:09.525094	2025-09-21 19:35:09.525094	2025-08-22 19:35:09.525094	2025-08-22 19:35:09.525094
1d6d3777-5a39-491a-8970-7e358c239277	New Arrivals	Discover the latest fashion trends for kids. Fresh styles added weekly!	https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600	/products?featured=true	Explore New	2	slider	home	t	2025-08-22 19:35:09.525094	2025-10-21 19:35:09.525094	2025-08-22 19:35:09.525094	2025-08-22 19:35:09.525094
ebc1460e-dd60-4372-8b6a-3486c0a407e5	Back to School	Get ready for school with our premium uniform collection and school essentials.	https://images.unsplash.com/photo-1554321656-80f253482d05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600	/products?category=school-uniforms	Shop Uniforms	3	slider	home	t	2025-08-12 19:35:09.525094	2025-09-11 19:35:09.525094	2025-08-22 19:35:09.525094	2025-08-22 19:35:09.525094
d9083348-6bfd-4a05-a3f2-45a9136f435a	Free Shipping Banner	Free shipping on orders over $75 nationwide!	https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400	\N	\N	1	banner	home	t	2025-08-22 19:35:09.525094	2025-11-20 19:35:09.525094	2025-08-22 19:35:09.525094	2025-08-22 19:35:09.525094
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, password, first_name, last_name, profile_image_url, is_admin, auth_provider, created_at, updated_at) FROM stdin;
b31f27b5-2619-4474-bc05-5896bdaaf91b	admin@example.com	$2b$12$q9nKAnLFC8arE1vu6gmcZuJkyD1FccSsEcbjcO3sOuZI6RPsNi8ny	Admin	User	\N	t	email	2025-08-22 19:26:45.319182	2025-08-22 19:26:45.319182
b6458cef-c6f0-448d-ac94-ed1ab85b151a	john.smith@email.com	$2b$12$q9nKAnLFC8arE1vu6gmcZuJkyD1FccSsEcbjcO3sOuZI6RPsNi8ny	John	Smith	\N	f	email	2025-08-22 19:35:26.874622	2025-08-22 19:35:26.874622
20aae49e-05be-4b79-95a1-f40348d2cf49	sarah.johnson@email.com	$2b$12$q9nKAnLFC8arE1vu6gmcZuJkyD1FccSsEcbjcO3sOuZI6RPsNi8ny	Sarah	Johnson	\N	f	email	2025-08-22 19:35:26.874622	2025-08-22 19:35:26.874622
8ce03652-103b-4cf9-a0ae-1a6dd4ed1f7c	mike.brown@email.com	$2b$12$q9nKAnLFC8arE1vu6gmcZuJkyD1FccSsEcbjcO3sOuZI6RPsNi8ny	Mike	Brown	\N	f	email	2025-08-22 19:35:26.874622	2025-08-22 19:35:26.874622
add4a71d-0ecc-43f8-a2b6-d6b72df3e9fd	emily.davis@email.com	$2b$12$q9nKAnLFC8arE1vu6gmcZuJkyD1FccSsEcbjcO3sOuZI6RPsNi8ny	Emily	Davis	\N	f	email	2025-08-22 19:35:26.874622	2025-08-22 19:35:26.874622
46775099	yalibek286@chaublog.com	\N	ok	pepli	\N	f	email	2025-08-22 19:49:22.989391	2025-08-22 19:49:22.989391
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.wishlist_items (id, user_id, product_id, created_at) FROM stdin;
\.


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: coupon_usage coupon_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupon_usage
    ADD CONSTRAINT coupon_usage_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_unique UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payment_settings payment_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payment_settings
    ADD CONSTRAINT payment_settings_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_unique UNIQUE (sku);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: site_settings site_settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_key_unique UNIQUE (key);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: sliders sliders_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sliders
    ADD CONSTRAINT sliders_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

