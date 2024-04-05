#include <iostream>
#include <fstream>
#include <string>

using std::string;
using std::ofstream;
using std::cout;
using std::endl;

extern "C"  void saveFile(const char* filepath,const char* content)
{
    ofstream open_file(filepath);
    open_file << content; 

    open_file.close();
}
