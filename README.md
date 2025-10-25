# Welcome to the OMERA HOTEL Project

## Project Overview

This is the front-end application for the **OMERA HOTEL**, designed to deliver a minimal, elegant, and upscale digital experience. It is built using a modern, scalable stack to ensure performance and maintainability.

## Technologies Used

This project leverages the following cutting-edge technologies:

- **Vite**: For extremely fast development and instant code updates.
- **TypeScript**: Provides static typing to enhance code quality and reduce errors, crucial for a reliable application.
- **React**: The core library used to build the responsive and modular user interface.
- **shadcn/ui**: A collection of beautifully designed, reusable UI components, built for elegance and consistency, perfectly suited for an upscale brand.
- **Tailwind CSS**: A utility-first framework that enables rapid, custom styling while maintaining a clean, minimal aesthetic.

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

You must have **Node.js** (version 16 or later is recommended) and **npm** installed on your system. Using a version manager like [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is highly recommended.

### Local Development

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/OMERA-TECHNOLOGY/omera-hotel.git
    ```

2.  **Navigate to the project directory:**

    ```sh
    cd omera-hotel
    ```

3.  **Install dependencies:**

    ```sh
    npm install
    ```

4.  **Start the development server:**
    This command will launch the development server with live-reloading. The application will typically be accessible at `http://localhost:5173`.
    ```sh
    npm run dev
    ```

---

## Deployment

### Building and Deploying

The project is structured to be easily deployed to standard hosting platforms (like Vercel, Netlify, or AWS Amplify).

1.  **Generate the production build:**

    ```sh
    npm run build
    ```

    This command compiles and optimizes the application, placing the final assets in the **`dist`** directory.

2.  **Deploy the `dist` folder:**
    Upload the contents of the generated **`dist`** folder to your chosen hosting service.

### Custom Domain Setup

To connect a custom domain (e.g., `www.omerahotel.com`), you will need to configure your domain's DNS settings (A record or CNAME) to point to your hosting provider. Refer to your hosting platform's documentation for the specific steps required to integrate your domain.
