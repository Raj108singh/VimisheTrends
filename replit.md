# Overview

This is a full-stack e-commerce application for children's fashion called "Vimishe Fashion Trends". The application is built with a React frontend and Express.js backend, featuring a comprehensive product catalog, shopping cart functionality, user authentication, and admin management capabilities. The system supports product browsing, cart management, order processing, user profiles, and administrative functions for managing products and categories.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Wouter for Routing**: Lightweight client-side routing solution
- **TanStack Query**: Server state management for API calls and caching
- **Zustand**: Client-side state management for cart functionality
- **Shadcn/ui Components**: Pre-built UI component library with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form + Zod**: Form handling with schema validation

## Backend Architecture
- **Express.js**: RESTful API server with middleware-based request processing
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Session-based Authentication**: Uses express-session with PostgreSQL session store
- **Replit OAuth Integration**: Authentication via Replit's OpenID Connect provider

## Database Design
- **PostgreSQL**: Primary database with the following key entities:
  - Users: User profiles and authentication data
  - Categories: Hierarchical product categorization
  - Products: Product catalog with images, pricing, and inventory
  - Orders & OrderItems: Order management and line items
  - Cart Items: Shopping cart persistence
  - Wishlist Items: User wishlist functionality
  - Reviews: Product review system
  - Sessions: Session storage for authentication

## API Structure
- RESTful endpoints organized by resource type
- Comprehensive product management (CRUD operations)
- Category management with hierarchical support
- Shopping cart operations (add, update, remove)
- Order processing and history
- User profile management
- Review system for products
- Admin-specific endpoints for content management

## Authentication & Authorization
- **Replit OAuth**: Primary authentication method using OpenID Connect
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Role-based Access**: Admin flag for privileged operations
- **Middleware Protection**: Route-level authentication checks

## State Management Strategy
- **Server State**: TanStack Query handles API data, caching, and synchronization
- **Client State**: Zustand manages cart state with persistence
- **Form State**: React Hook Form manages form inputs and validation
- **UI State**: React's built-in state for component-level interactions

# External Dependencies

## Authentication Services
- **Replit OAuth**: Primary authentication provider using OpenID Connect protocol
- **Passport.js**: Authentication middleware for Express.js

## Database & ORM
- **Neon Database**: PostgreSQL hosting service via @neondatabase/serverless
- **Drizzle ORM**: Type-safe database operations and migrations
- **connect-pg-simple**: PostgreSQL session store for express-session

## Frontend Libraries
- **Radix UI**: Comprehensive set of low-level UI primitives for accessibility
- **TanStack Query**: Data fetching and server state management
- **Zustand**: Lightweight state management solution
- **React Hook Form**: Performant form library with validation
- **Wouter**: Minimalist routing library for React

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking across the entire stack
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast bundling for production builds

## UI Components
- **Shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating component variants