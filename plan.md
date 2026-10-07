I already connected my Figma design to this project through Figma MCP/OpenCode.

I want you to convert my existing Figma design into a FULLY FUNCTIONAL React Native application.

The Figma design is the MAIN SOURCE OF TRUTH. Do not redesign the application unnecessarily. Recreate the design as closely as possible while making every feature functional.

## TECHNOLOGY REQUIREMENTS

Use:

* React Native
* JavaScript or TypeScript, depending on the existing project setup
* React Navigation if navigation is needed
* AsyncStorage for local data persistence if needed
* Figma MCP/OpenCode for inspecting and following the Figma design

The application must be CROSS-PLATFORM.

It should be designed to work on:

* Android
* iOS

If the project is using Expo, keep using Expo.
If the project is already configured with React Native CLI, keep the existing setup.

DO NOT convert this into:

* HTML/CSS website
* React.js web application
* PHP application
* Flutter application

This must remain a React Native mobile application.

---

# MAIN GOAL

Turn the Figma design into a working Matcha Shop mobile application.

The final application should:

1. Look very close to the Figma design.
2. Have working navigation.
3. Have working buttons.
4. Have working product interactions.
5. Have working cart functionality.
6. Have working search/filter functionality if shown in Figma.
7. Have working favorites if shown.
8. Have a working frontend-only checkout flow if shown.
9. Work without a database.
10. Use local data and AsyncStorage where persistence is required.
11. Work properly on Android and iOS.
12. Be responsive to different mobile screen sizes.

---

# IMPORTANT: FIGMA DESIGN

Before coding, inspect the connected Figma design carefully.

Identify all:

* Screens
* Pages
* Components
* Buttons
* Navigation
* Product cards
* Icons
* Images
* Forms
* Modals
* Bottom navigation
* Headers
* Search bars
* Categories
* Cart screens
* Checkout screens
* Profile screens
* Favorite screens
* Empty states
* Success states

Use the Figma design as the visual source of truth.

Match as closely as possible:

* Colors
* Typography
* Font sizes
* Font weights
* Spacing
* Padding
* Margins
* Border radius
* Shadows
* Card sizes
* Icons
* Images
* Navigation
* Screen layouts

Do not replace the Figma UI with a generic design.

---

# NO DATABASE

IMPORTANT:

DO NOT create or require a database.

Do NOT use:

* MySQL
* MongoDB
* Firebase database
* Supabase database
* PostgreSQL
* PHP backend
* Express backend
* External API

The application should work completely on the frontend.

Use local JavaScript/TypeScript data.

For persistent data, use:

AsyncStorage

Possible storage keys:

* matcha_cart
* matcha_favorites
* matcha_orders
* matcha_user

The app should still work after closing and reopening the application.

---

# PRODUCT DATA

Create a local product data structure.

Example:

const products = [
{
id: 1,
name: "Classic Matcha Latte",
category: "Drinks",
price: 120,
description: "Smooth and creamy Japanese-style matcha latte.",
image: require("./assets/matcha-latte.png")
}
];

Use the products shown in the Figma design if product information is available.

If the Figma design does not contain actual product data, create appropriate sample Matcha Shop products.

Do not add unnecessary features that are not related to the design.

---

# NAVIGATION

Implement functional React Native navigation.

If the Figma design contains multiple screens, create navigation between them.

For example:

Home
→ Product Details
→ Cart
→ Checkout
→ Order Success

And if present:

Home
→ Search

Home
→ Favorites

Home
→ Profile

Use the navigation structure suggested by the Figma design.

Make sure:

* Back buttons work.
* Navigation buttons work.
* Bottom navigation works.
* Header navigation works.
* No screen leads to a broken page.
* Navigation works on Android and iOS.

---

# HOME SCREEN

Implement the complete Home screen from Figma.

Make all interactive elements functional.

For example:

* Hero buttons
* Product cards
* Category buttons
* Search
* Favorites
* Cart
* Navigation

Do not leave buttons that do nothing.

---

# PRODUCT FUNCTIONALITY

Each product should support:

* View product
* View product details
* Select quantity
* Add to cart
* Add/remove favorite

If the Figma design includes product customization, implement it using local state.

For example:

* Size
* Quantity
* Add-ons
* Sweetness level

Only implement options that actually exist in the design.

---

# SHOPPING CART

Make the cart fully functional.

Users should be able to:

* Add product
* Increase quantity
* Decrease quantity
* Remove product
* See subtotal
* See total quantity
* See total price
* Empty cart

Update the cart icon/count automatically.

Store the cart using AsyncStorage.

Example:

matcha_cart

When the application starts, load the saved cart.

When the cart changes, update AsyncStorage.

---

# SEARCH

If search exists in the Figma design:

Implement real local search.

Users should be able to search products by:

* Product name
* Category
* Description

Show matching products.

If there are no results, show a proper empty state matching the design.

---

# CATEGORY / FILTER

If categories exist:

Make them functional.

For example:

All
Drinks
Desserts
Snacks

When the user selects a category, display only matching products.

Keep the design consistent with Figma.

---

# FAVORITES

If the Figma design has favorite/heart buttons:

Make them functional.

Users should be able to:

* Add favorite
* Remove favorite
* View favorite products

Save favorites using AsyncStorage.

Update the heart icon immediately.

---

# CHECKOUT

If checkout exists in the Figma design:

Make it functional without a backend.

Display:

* Products
* Quantities
* Prices
* Subtotal
* Total

If the design includes customer information:

Create a form for:

* Name
* Phone number
* Address

Add validation.

Do NOT connect to a real payment system.

Use a frontend-only/mock checkout.

After successful checkout:

* Generate an order number.
* Display the order confirmation screen.
* Clear the cart.
* Save the order locally using AsyncStorage.

Example:

MATCHA-20261004-001

---

# ORDER HISTORY

If the Figma design includes order history:

Store completed orders locally.

Use AsyncStorage.

Users should be able to view:

* Order number
* Date
* Products
* Total
* Order status

No backend is required.

---

# FORMS

All forms must be functional.

Validate required fields.

Show clear error messages.

Examples:

"Please enter your name."

"Please enter your phone number."

"Please enter your address."

Do not allow invalid forms to continue.

---

# RESPONSIVE MOBILE DESIGN

This is VERY IMPORTANT.

The application must work on different mobile screen sizes.

Test approximately:

* 320 × 568
* 360 × 800
* 375 × 812
* 390 × 844
* 414 × 896
* 430 × 932

Make sure:

* No content is cut off.
* No overlapping elements.
* No horizontal scrolling.
* Text fits properly.
* Buttons are accessible.
* Images scale properly.
* Cards resize properly.
* Forms fit the screen.
* Bottom navigation does not cover content.
* Keyboard does not hide important form fields.

Use React Native responsive techniques such as:

* Dimensions
* useWindowDimensions
* Flexbox
* ScrollView
* FlatList
* SafeAreaView / Safe Area handling

Do not use fixed widths and heights unnecessarily.

---

# CROSS-PLATFORM REQUIREMENT

The application must work correctly on both:

## Android

Check:

* Navigation
* Touch interactions
* Keyboard
* Status bar
* Safe areas
* Scrolling
* Buttons
* Images

## iOS

Check:

* Safe areas
* Status bar
* Navigation
* Keyboard
* Scrolling
* Touch interactions
* Images

Avoid platform-specific code unless it is necessary.

If platform-specific code is required, use React Native's Platform API appropriately.

Example:

Platform.OS === "ios"

Do not create separate versions of the application unless absolutely necessary.

The goal is ONE React Native codebase that works across platforms.

---

# MOBILE UI / UX

This is a mobile-first application.

Use:

* Touch-friendly buttons
* Proper spacing
* Scrollable content
* FlatList for product lists
* Pressable/TouchableOpacity for interactions
* Safe areas
* Responsive layouts

Do not depend on hover effects because mobile devices do not have hover.

---

# IMAGES AND ASSETS

Use the images/assets from the Figma design when available.

If images are not available:

* Use local placeholder assets.
* Keep the same dimensions/aspect ratio as the Figma design.
* Do not use random external image URLs unless necessary.

Make sure images do not break the layout.

---

# COMPONENT STRUCTURE

Keep the React Native project organized.

Use reusable components when appropriate.

For example:

components/
ProductCard
CategoryButton
SearchBar
CartItem
CustomButton
Header
BottomNavigation

screens/
HomeScreen
ProductDetailsScreen
CartScreen
CheckoutScreen
OrderSuccessScreen
FavoritesScreen
ProfileScreen

data/
products

utils/
storage

Do not create unnecessary complexity.

Keep the code beginner-friendly and easy to understand.

---

# STATE MANAGEMENT

Use simple React state where possible.

For example:

useState
useEffect
useContext

Do not add Redux or other complicated state management libraries unless the existing project already uses them or it is genuinely necessary.

Keep the application simple.

---

# ASYNC STORAGE

Use AsyncStorage for local persistence.

Persist:

* Cart
* Favorites
* Orders
* Other necessary user preferences

When the application starts:

1. Load saved data.
2. Set the state.
3. Display the saved information.

When data changes:

1. Update state.
2. Save the updated data.

Handle empty or invalid storage safely.

---

# ERROR HANDLING

The application must not crash when:

* Cart is empty.
* Favorites are empty.
* Search has no results.
* AsyncStorage has no data.
* Product is missing.
* Image is unavailable.
* Form input is invalid.

Show friendly UI messages instead.

---

# ACCESSIBILITY

Use:

* Accessible labels
* Meaningful button names
* Proper image descriptions
* Touchable areas large enough for mobile
* Good text contrast

---

# PERFORMANCE

Keep the application lightweight.

Use:

* FlatList for long product lists.
* Avoid unnecessary re-renders.
* Avoid unnecessary libraries.
* Avoid loading large images unnecessarily.
* Keep animations smooth.

---

# DO NOT BREAK EXISTING PROJECT

Before changing the project:

1. Inspect the existing files.
2. Understand the current React Native setup.
3. Check whether it uses Expo or React Native CLI.
4. Keep the existing configuration.
5. Do not unnecessarily delete working code.
6. Install dependencies only when necessary.

Do not replace the entire project structure unless required.

---

# TESTING

After implementation, test every feature.

Test:

* App startup
* Home screen
* Navigation
* Back button
* Product list
* Product details
* Search
* Category filters
* Favorites
* Add to cart
* Remove from cart
* Increase quantity
* Decrease quantity
* Cart total
* Checkout
* Form validation
* Order confirmation
* AsyncStorage
* App reload
* Mobile responsiveness
* Android compatibility
* iOS compatibility

Fix all errors you find.

---

# FINAL REQUIREMENTS

Before considering the project complete, verify the following:

[ ] Figma design is followed closely.

[ ] React Native is used.

[ ] The application is cross-platform.

[ ] Android is supported.

[ ] iOS is supported.

[ ] No database is required.

[ ] No backend is required.

[ ] Local product data is used.

[ ] AsyncStorage is used where persistence is needed.

[ ] Navigation works.

[ ] All important buttons work.

[ ] Cart works.

[ ] Product interactions work.

[ ] Search works if present.

[ ] Categories/filters work if present.

[ ] Favorites work if present.

[ ] Checkout works if present.

[ ] Forms have validation.

[ ] Empty states are handled.

[ ] The UI is responsive.

[ ] No horizontal scrolling occurs.

[ ] No elements overlap.

[ ] No major console/runtime errors remain.

[ ] The application works after restarting.

[ ] The code is organized and understandable.

MOST IMPORTANT:

Do not just reproduce the appearance of the Figma design.

Convert the Figma design into a REAL FUNCTIONAL React Native application.

Use the Figma design for the UI and UX, React Native for the implementation, local JavaScript/TypeScript data for products, and AsyncStorage for local persistence.

The final result should feel like a real Matcha Shop mobile application while remaining completely functional WITHOUT a database or backend.
