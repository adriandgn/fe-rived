# **UI/UX Guidelines**

## **Visual Language**

* **Theme:** "Maia" (Shadcn preset).  
* **Base Color:** Zinc.  
* **Primary Accent:** Emerald (reflecting nature/upcycling).  
* **Radius:** Small.

## **Shadcn Initialization Command**

npx shadcn@latest create \--preset "https://ui.shadcn.com/init?base=base\&style=maia\&baseColor=zinc\&theme=emerald\&iconLibrary=lucide\&font=inter\&menuAccent=bold\&menuColor=inverted\&radius=small\&template=next" \--template next

## **Navigation UX**

* **Mobile:** Bottom Navigation Bar (Fixed).  
  * Items: Home, Search, Create (+), Profile.  
* **Desktop:** Sticky Top Navigation Bar.  
  * Items: Logo, Central Search Bar, Create Button, User Dropdown.

## **Feed Layout (Masonry)**

* **Style:** Pinterest-like vertical masonry.  
* **Implementation:** CSS Columns (columns-2 md:columns-3 lg:columns-4).  
* **Card Behavior:**  
  * **Image:** High quality, variable aspect ratio.  
  * **Info:** Minimalist footer (Author avatar \+ Title).  
  * **Hover (Desktop):** Show interactions (Like/Comment).  
  * 