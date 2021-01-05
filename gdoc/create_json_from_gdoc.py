import os.path
import json
from more_itertools import locate

def main():
    # load json file 
    with open('./gdoc_json_test.json', encoding="utf8") as json_file:
        gdoc_json = json.load(json_file)
    
    
    new_json = {}
    curr_key = ""

    def create_nested_json(curr_list,curr_dict,prev_dict,prev_key,lev):
        type_of_style = curr_list[0].get("paragraph").get("paragraphStyle").get("namedStyleType")
        #print(type_of_style)
        #print(len(curr_list))


        if (type_of_style == "HEADING_" + str(lev)):
            
            index_pos_list = list(locate(curr_list, lambda par: par.get("paragraph").get("paragraphStyle").get("namedStyleType") == type_of_style))
            index_pos_list_end = [el for el in index_pos_list]
            index_pos_list_end.append(len(curr_list))
            
            #print(index_pos_list_end)
            i = 0
            for index in index_pos_list:
                curr_key = curr_list[index].get("paragraph").get("elements")[0].get("textRun").get("content").strip("\n")
                #print(curr_key)
                curr_sub_list = [curr_list[ind] for ind in range(index_pos_list_end[i]+1,index_pos_list_end[i+1])]
                i = i+1

                curr_dict[curr_key] = dict()
                create_nested_json(curr_sub_list,curr_dict[curr_key], curr_dict,curr_key,lev+1)
                



        elif (type_of_style == "NORMAL_TEXT"):
            #print("normal text")
            #print(curr_dict)
            prev_dict[prev_key] = ""
            for par in curr_list: 
                prev_dict[prev_key] = prev_dict[prev_key] + par.get("paragraph").get("elements")[0].get("textRun").get("content")
            
            print(prev_dict[prev_key][-1:])
            if prev_dict[prev_key][-1:] == "\n":
                prev_dict[prev_key] = prev_dict[prev_key][:-1]
        
        

        

    create_nested_json(gdoc_json,new_json,{},"",1)
    
    with open('./generated_json_from_doc.json', 'w') as outfile:
        json.dump(new_json, outfile,indent=2)



if __name__ == '__main__':
    main()