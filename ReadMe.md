Brandon Mok - Client Programming project #2

http://serenity.ist.rit.edu/~bxm5989/ClientProject2/


Plugins used:
UI,
jquerymodal,
Browser detection,
Smooth Scroll,
SlickNav


Above and Beyond:
Features and development practices that I felt makes my project above and beyond involves
trying to keep the data load and data plan of users low when loading the site. I primarily
used modals as each area and specific sections only had the minimal front modal information
load and show. Once the user clicks on the specific modal, then I load and configure the data
for the section as to save on the data load. I also configured the project so that there is either zero
or one backmodal appended on the dom: if user clicks on a front modal, I either
create the backmodal (if not existent) or grab the existing back modal, clear its contents, then replace
the information.

Another feature that I felt was above and beyond was making the project mobile friendly.
I utilized media queries to format the information to be viewable by a mobile device while also
having a navigation plugin, and hiding/showing information based on data.